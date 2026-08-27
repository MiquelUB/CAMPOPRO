import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No s'ha proporcionat cap fitxer." },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: "No s'ha configurat la clau OPENROUTER_API_KEY a l'entorn." },
        { status: 500 }
      );
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const mimeType = file.type || "application/pdf";

    // Encode file to base64
    const base64Data = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    const prompt = `Analitza aquest document (un albarà o factura) i extreu-ne tota la informació.
IMPORTANT: NO t'inventis cap DADA ni cap NIF. Si alguna dada no està present, retorna null. Si el proveïdor no té NIF visible, retorna null a nif. Extreu totes les línies d'articles.

REGLA CRÍTICA DE CLASSIFICACIÓ PER A CADA ARTICLE (tipus):
1. "EINA": Eines manuals o elèctriques, equips duradors o maquinària de treball que NO es consumeixen ni s'instal·len de forma permanent a l'obra (Exemples: Tisores de podar, serrells, taladros, soldadores, claus d'ungla, alicates, martells, bombes de buit portàtils, desbroçadores).
2. "MATERIAL": Productes consumibles o materials que queden instal·lats permanentment a la finca/obra (Exemples: Tuberies, connectors, fittings, abonaments, fertilitzants, cargols, cinta, cable, olis, filtres, electrovàlvules).
3. "SERVEI": Transport, mà d'obra, lloguer o gestió.

RETORNA NOMÉS UN JSON VÀLID (sense text addicional) amb la següent estructura exacta:
{
  "es_factura": boolean,
  "num_document": "string",
  "data_emissio": "YYYY-MM-DD",
  "proveidor": {
    "nom": "string",
    "nif": "string o null",
    "email": "string o null",
    "telefon": "string o null"
  },
  "items": [
    {
      "codi": "string o null",
      "descripcio": "string",
      "quantitat": number,
      "preu_unitari": number,
      "tipus": "EINA" | "MATERIAL" | "SERVEI"
    }
  ]
}`;

    const payload = {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUri,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    };

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://campopro.cat", 
        "X-Title": "CampoPro",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter API Error:", res.status, errText);
      throw new Error(`Error del servidor OpenRouter: ${res.status}`);
    }

    const jsonResponse = await res.json();
    let resultText = jsonResponse.choices[0].message.content;
    
    // Clean potential markdown blocks if present
    if (resultText.startsWith("```json")) {
        resultText = resultText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (resultText.startsWith("```")) {
        resultText = resultText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: any) {
    console.error("OCR API Error:", error);
    return NextResponse.json(
      { error: error.message || "Error intern al processar el document amb IA" },
      { status: 500 }
    );
  }
}
