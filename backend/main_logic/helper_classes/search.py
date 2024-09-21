import logging

logging.basicConfig(level=logging.INFO)

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