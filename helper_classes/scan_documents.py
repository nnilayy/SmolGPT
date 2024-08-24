import os
import zipfile
import tempfile
import logging
from langchain_core.documents import Document
from langchain_community.document_loaders import (PyPDFLoader, 
                                                  Docx2txtLoader, 
                                                  UnstructuredExcelLoader, 
                                                  UnstructuredPowerPointLoader,
                                                  TextLoader,
                                                  CSVLoader,
                                                  YoutubeLoader)
from langchain.text_splitter import RecursiveCharacterTextSplitter
logging.basicConfig(level=logging.INFO)


class ScanDocuments:
    def __init__(self):
        pass
    
    def upload_single_file(self, path):
        if path.endswith(".pdf"):
            loader = PyPDFLoader(path)
        elif path.endswith(".docx"):
            loader = Docx2txtLoader(path)
        elif path.endswith(".xlsx"):
            loader = UnstructuredExcelLoader(path, encoding = 'UTF-8')
        elif path.endswith(".pptx"):
            loader = UnstructuredPowerPointLoader(path, encoding = 'UTF-8')
        elif path.endswith(".txt") or path.endswith(".md"):
            loader = TextLoader(path, encoding = 'UTF-8')
        elif path.endswith(".csv"):
            loader = CSVLoader(path, encoding = 'UTF-8')
        data = loader.load_and_split()
        return data
    
    def upload_url(self, url):
        if "www.youtube.com" in url:
            loader =  YoutubeLoader.from_youtube_url(url,add_video_info=True)
        data = loader.load_and_split()
        return data
    
    def upload_from_raw_text(self, text):
        data = [Document(page_content = text)]
        return data
    
    def upload_zip_file(self, zip_path):
        data = []
        with tempfile.TemporaryDirectory() as temp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
                for root, dirs, files in os.walk(temp_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        try:
                            single_file_data = self.upload_single_file(file_path)
                            data+=single_file_data
                        except ValueError as e:
                            print(f"Skipping {file_path}: {e}")
        return data
    
    def process_document(self, data):
        doc_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len)
        documents = doc_splitter.split_documents(data)
        return documents
