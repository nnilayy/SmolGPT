from langchain_community.document_loaders import (PyPDFLoader, 
                                                  Docx2txtLoader, 
                                                  UnstructuredExcelLoader, 
                                                  UnstructuredPowerPointLoader,
                                                  TextLoader,
                                                  CSVLoader,
                                                  YoutubeLoader)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
import os
from langchain_core.documents import Document
import logging
logging.basicConfig(level=logging.INFO)
files = [
"files/2205.15868v1-CogVideo-Large-scale Pretraining for Text-to-Video.pdf",
'files/IM-Report.docx',
"files/UNIT-2.pptx",
"files/Hperverge OT list final.xlsx",
"files/hey.txt",
"files/test.md",
]
file_path = files[2]
print(file_path)

class Model:
    def __init__(self, llm, embeddings):
        self.llm = llm
        self.embeddings = embeddings


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


class VectorStore:
    def __init__(self, model, search_num_docs):
        self.model = model
        self.search_num_docs = search_num_docs
        self.vectordb = self.initialize_vector_store()
        self.retriever = self.vectordb.as_retriever(search_kwargs={"k": self.search_num_docs})
        self.qa_chain = self.setup_qa_chain()

    def initialize_vector_store(self):
        """Initialize or load the FAISS vector database."""
        if not os.path.exists("./faiss_vectordb"):
            logging.info("Creating FAISS Vector Store")
            vectordb = FAISS.from_documents(documents=[Document(page_content="")],
                                            embedding=self.model.embeddings)
            vectordb.save_local("faiss_vectordb")
        else:
            logging.info("Loading FAISS Vector Store")
            vectordb = FAISS.load_local("faiss_vectordb",
                                         embeddings=self.model.embeddings, 
                                         allow_dangerous_deserialization=True)
        return vectordb

    def setup_qa_chain(self):
        """Set up the QA chain using the retriever."""
        return RetrievalQA.from_chain_type(
            llm=self.model.llm,
            chain_type="stuff",
            retriever=self.retriever,
            return_source_documents=True
        )

    def add_documents(self, documents):
        """Add documents to the vector database."""
        self.vectordb.add_documents(documents)
        logging.info(f"Added {len(documents)} documents to the vector store.")

class Search:
    def __init__(self, Model):
        self.model = Model
        self.wikipeadia = None
        self.duckduckgo = None
        self.jinai = None
        self.googleserper = None
        # self.bing = None
        # self.brave = None
        self.base_engine = self.duckduckgo

    def search_base_engine(self, query):
        results = self.base_engine.search(query)
        return results

    def search_multi_engines(self, query):
        wikipedia_results = self.wikipeadia.run(query)
        duckduckgo_results = self.duckduckgo.run(query)
        jina_ai_results = self.jinai.run(query)
        google_serper_results = self.googleserper.run(query)
        
        multi_engine_results = {
            "wikipedia": wikipedia_results,
            "duckduckgo": duckduckgo_results,
            "jina_ai": jina_ai_results,
            "google_serper": google_serper_results
        }
        return multi_engine_results

    def search_best_sites_for_query(self, query):
        prompt = f"""You are a helpful Assistant, You would be Provided a Query by the user, You Have to take the 
        query, extract the main idea behind the query and provide the a sentence which would say:

        Best Sites to Inquire more about query

        For Example:

        User: What is the temperature in Japan?
        Answer: sites to find about weather conditions of countries?:

        Now Create the Reverse Query for the given Query by the user:
        User:{query}
        Answer:
        """
        search_query = self.model.llm.invoke(prompt)
        sites = "https://s.jina.ai/"+search_query
        return sites        

# ------------------------------------------------------------------------------
# ------------------------------------------------------------------------------
# Google Drive: [https://python.langchain.com/v0.2/docs/integrations/document_loaders/google_drive]
# BibTeX: [https://python.langchain.com/v0.2/docs/integrations/document_loaders/bibtex]
# ArxivLoader, []
