import logging
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
        
    def upload_zip_file(self):
        pass
    def process_document(self, data):
        doc_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len)
        documents = doc_splitter.split_documents(data)
        return documents
