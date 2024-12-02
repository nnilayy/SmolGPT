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

class YoutubeTool:
    def __init__(self):
        self.uploader = ScanDocuments()
        self.model = Model(llm=llm, embeddings=embedding)
        self.vector_store = VectorStore(model=self.model, search_num_docs=10)
        self.cached_url = None  # Store the last processed URL
        self.tool = Tool(
            name="Youtube Parser Tool",
            func=self.invoke,
            description="""Useful for extracting and analyzing information from YouTube videos. 
            The input MUST be provided in the format 'youtube_url:::your_question' where:
            - Before the ':::' : Paste the complete YouTube video URL
            - After the ':::' : Write your specific question about the video content
            
            Examples:
            - 'https://youtube.com/watch?v=12345:::What are the main topics discussed?'
            - 'https://youtu.be/abcdef:::Summarize the key points from minutes 2-5'
            
            Do NOT use this tool without providing both the URL and a question in the correct format.
            """
        )

    def invoke(self, combined_input):
        url, query = combined_input.split(":::")
        
        # Only process and add documents if it's a new URL
        if url != self.cached_url:
            data = self.uploader.upload_youtube_url(url)
            self.vector_store.add_documents(data)
            self.cached_url = url
            
        response = self.vector_store.qa_chain.invoke({"query": query})
        return response