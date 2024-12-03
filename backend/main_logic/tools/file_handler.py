import os
import nest_asyncio
from dotenv import load_dotenv
from main_logic.helper_classes.vector_store import VectorStore
from main_logic.helper_classes.scan_documents import ScanDocuments
from main_logic.helper_classes.model import Model
from langchain.agents import Tool
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI


load_dotenv()

nest_asyncio.apply()

# Initialize the model for summarization
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

class FileHandlerTool:
    def __init__(self):
        self.folder_path = "temporary_folder"
        self.uploader = ScanDocuments()
        self.model = Model(llm=llm, embeddings=embedding)
        self.vector_store = VectorStore(model=self.model, search_num_docs=15)
        self.processed_files = set()
        
        self.tool = Tool(
            name="File Handler Tool",
            func=self.invoke,
            description="""Useful for when you want to answer questions about the uploaded documents.
            Whenever you are asked a question about an uploaded document, you should use this tool. Never use cached answer.
            
            The input MUST be provided in the format 'query' where:
            - 'query' is the question you want to ask about the uploaded documents
            """
        )

    def invoke(self, query):
        for file in os.listdir(self.folder_path):
            file_path = os.path.join(self.folder_path, file)
            if file not in self.processed_files:
                data = self.uploader.upload_single_file(file_path)
                self.vector_store.add_documents(data)
                self.processed_files.add(file)
                os.remove(file_path)
                
        response = self.vector_store.qa_chain.invoke({"query": query})
        return response