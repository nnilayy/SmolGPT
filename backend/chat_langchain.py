import warnings
import warnings
from langchain import hub
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from pydantic import PydanticDeprecatedSince20

from langchain.agents import create_react_agent
from langchain.agents.agent import AgentExecutor
from langchain.memory import ConversationBufferMemory, ConversationBufferWindowMemory
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from main_logic.helper_classes.model import Model
from main_logic.helper_classes.search import Search
from main_logic.helper_classes.converser import Converser
from main_logic.helper_classes.vector_store import VectorStore
from main_logic.helper_classes.scan_documents import ScanDocuments

from main_logic.tools.calculator_tool import CalculatorTool
from main_logic.tools.weather_time_tool import WeatherTimeTool

from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_cohere import ChatCohere
from langchain_anthropic import ChatAnthropic
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()  
warnings.filterwarnings("ignore", category=PydanticDeprecatedSince20)


# DOCUMENTS
# uploader = ScanDocuments()
# data = uploader.upload_single_file("files/2205.15868v1-CogVideo-Large-scale Pretraining for Text-to-Video.pdf")
# documents = uploader.process_document(data)


# LLMS AND EMBEDDINGS
# def chat(user_message):
#     try:
#         embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#         llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
#         # llm = ChatGroq(model="mixtral-8x7b-32768")
#         model = Model(llm, embeddings)


        # VECTOR STORE
        # vector_store = VectorStore(model, search_num_docs=10)
        # vector_store.add_documents(documents)


        # TOOLS
        # weather_time_tool = WeatherTimeTool(model)
        # search_engine_tool = TavilySearchResults()
        # calculator_tool = CalculatorTool()


        # tools = [
        #     search_engine_tool, # Tool to search the web
        #     # vector_store.vectordb_search_tool, # Tool To Search the Vector Data Base
        #     weather_time_tool.tool, # Tool to get the weather and time of a location
        #     calculator_tool.tool, # Tool to perform calculations
        #     ]


        # memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        # prompt = hub.pull("hwchase17/react")

        # AGENT
    #     agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)
    #     agent_executor = AgentExecutor.from_agent_and_tools(
    #         agent=agent,
    #         tools=tools,
    #         llm=llm,
    #         max_iterations=5,
    #         verbose=True,
    #         memory=memory,
    #         handle_parsing_errors=True,
    #         return_intermediate_steps=False,
    #     )

    #     ai_response = agent_executor.invoke({"input":user_message})['output']
    #     return ai_response
    # except Exception as e:
    #     print(f"Error getting AI response: {e}")
    #     return "Sorry, I'm unable to process your request at the moment."


class ChatHandler:
    def __init__(self, ChatModel, model_name):
        # Instantiate the LLM and Embeddings
        # self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
        # self.llm = ChatModel(model=model)
        # self.llm = ChatGroq(model="mixtral-8x7b-32768")
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        if ChatModel == 'ChatOpenAI':
            self.llm = ChatOpenAI(model=model_name)
        elif ChatModel == 'ChatCohere':
            self.llm = ChatCohere(model=model_name)
        elif ChatModel == 'ChatAnthropic':
            self.llm = ChatAnthropic(model=model_name)
        elif ChatModel == 'ChatMistralAI':
            self.llm = ChatMistralAI(model=model_name)
        elif ChatModel == 'ChatGoogleGenerativeAI':
            self.llm = ChatGoogleGenerativeAI(model=model_name)
        elif ChatModel == 'ChatGroq':
            self.llm = ChatGroq(model=model_name)

        self.model = Model(self.llm, self.embeddings)
        
        

        # Instantiate the tools
        self.tools = [
            TavilySearchResults(), 
            WeatherTimeTool(self.model).tool, 
            CalculatorTool().tool,
        ]

        # Instantiate the memory and prompt
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        # self.prompt = hub.pull("hwchase17/react-chat")
        self.prompt = hub.pull("nnilayy/demo")

        # Instantiate the agent and agent executor
        self.agent = create_react_agent(llm=self.llm, tools=self.tools, prompt=self.prompt)
        self.agent_executor = AgentExecutor.from_agent_and_tools(
            agent=self.agent,
            tools=self.tools,
            llm=self.llm,
            max_iterations=5,
            verbose=True,
            memory=self.memory,
            handle_parsing_errors=True,
            return_intermediate_steps=False
        )
        

    def chat(self, user_message):
        try:
            return self.agent_executor.invoke({"input":user_message})['output'].strip("```").strip("**")
        except Exception as e:
            print(f"Error getting AI response: {e}")
            return "Sorry, I'm unable to process your request at the moment."