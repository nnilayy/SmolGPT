import nest_asyncio
from dotenv import load_dotenv
from langchain.agents import Tool
from langchain_community.utilities.wolfram_alpha import WolframAlphaAPIWrapper

load_dotenv()

nest_asyncio.apply()

class CalculatorTool:
    def __init__(self):
        self.wolfram_alpha = WolframAlphaAPIWrapper()
        self.tool = Tool(
            name="Calculator Tool",
            func=self.invoke,
            description="""Useful for when you want to perform any kind of mathematical calculation. 
            You can ask to perform any kind of mathematical operation from Calculus, Arithmetic, Polynomial to any complex combination.
            If a proper answer is not returned, Just reply to the user that the a proper answer cannot be found for the given query.
            Return the Value after Answer: from the Answer string. 
            """
        )

    def invoke(self, query):
        response = self.wolfram_alpha.run(query)
        return response

