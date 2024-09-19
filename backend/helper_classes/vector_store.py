import os
import logging
from langchain.agents import Tool
from langchain.chains import RetrievalQA
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

logging.basicConfig(level=logging.INFO)

class VectorStore:
    def __init__(self, model, search_num_docs):
        self.model = model
        self.search_num_docs = search_num_docs
        self.vectordb = self.initialize_vector_store()
        self.retriever = self.vectordb.as_retriever(search_kwargs={"k": self.search_num_docs})
        self.qa_chain = self.setup_qa_chain()
        self.vectordb_search_tool = Tool(
            name = "Vector Database Search Tool",
            func=self.qa_chain.invoke,
            description="""Useful for when you want to search information regarding a document uploaded by the User. 
            If the User Query seems vague try to search for the same in vector Store and ask The user if the Query is regarding the paper in the Vector Store?
            """
            )

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