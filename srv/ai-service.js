const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  // Verbinde zum cap-llm-plugin als Service
  const capllmplugin = await cds.connect.to("cap-llm-plugin");
  
  this.on('testPrompt', async (req) => {
    try {
      const { query } = req.data;
      
      // Konfiguration aus der Umgebung holen
      const chatModelName = "gpt-4o";
      const chatModelConfig = cds.env.requires["gen-ai-hub"][chatModelName];

      console.log(chatModelConfig);
      
      // Einfachen Chat-Request ohne RAG erstellen
      const payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 100,
        "messages": [
            {
            "role": "user", 
            "content": "Hello, Claude"
            }
        ]
      };
      
      // Chat-Completion durchführen
      const response = await capllmplugin.getChatCompletionWithConfig(
        chatModelConfig,
        payload
      );
      
      // Antwortext extrahieren
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content;
      } else {
        return JSON.stringify(response);
      }
    }catch (error) {
      console.error('Fehler beim Testen des Prompts:', error);
      console.error('Detaillierter Fehler:', JSON.stringify(error, null, 2));
      throw new Error(`Fehler bei der KI-Anfrage: ${error.message}`);
    }
  });
});