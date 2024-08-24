import logging
from langchain.agents.agent import AgentExecutor

logging.basicConfig(level=logging.INFO)

class Converser:
    def __init__(self, runnable):
        self.runnable = runnable  

    def converse(self, single_question=False):
        from rich import print

        while True:
            user_input = input("User: ")
            print(f"User: {user_input}")
            if user_input == "exit":
                break

            if (isinstance(self.runnable, AgentExecutor)):
                response = self.runnable.invoke({"input":user_input})['output']
            else:
                response = self.runnable.invoke(user_input)
            print(f"Assistant: {response}")

            if single_question:
                break     
