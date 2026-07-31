# Skill: Generació PDF amb ReportLab

## Descripció
Aquesta skill presenta com crear PDFs professionals (com partes de feina, factures, informes) amb ReportLab utilitzant la configuració A4 i afegint taules, capçaleres, logotips, paginació i colors de línia alternats.

## Template

```python
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from io import BytesIO

class PDFReportGenerator:
    def __init__(self, empresa_nom: str, logo_path: str = None):
        self.empresa_nom = empresa_nom
        self.logo_path = logo_path
        self.styles = getSampleStyleSheet()

    def add_header_footer(self, canvas, doc):
        canvas.saveState()
        # Capçalera simple
        canvas.setFont('Helvetica-Bold', 14)
        canvas.drawString(2 * cm, 28 * cm, self.empresa_nom)
        
        # Pagina
        canvas.setFont('Helvetica', 9)
        canvas.drawString(18 * cm, 1 * cm, f"Pàgina {doc.page}")
        canvas.restoreState()

    def generate_job_report(self, dades_feina: dict) -> bytes:
        \"\"\"
        Genera el parte de treball: 
        dades_feina = {'id': '123', 'client': 'Joan', 'materials': [{'nom': 'Llavors', 'q': 2}], 'notes': 'Tot ok'}
        \"\"\"
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=2*cm, leftMargin=2*cm,
            topMargin=3*cm, bottomMargin=2*cm
        )

        elements = []

        # Títol
        elements.append(Paragraph(f"Informe de Treball: #{dades_feina['id']}", self.styles['Heading1']))
        elements.append(Paragraph(f"Client: {dades_feina['client']}", self.styles['Normal']))
        elements.append(Spacer(1, 1*cm))

        # Taula de Materials / Conceptes
        data_table = [['Concepte', 'Quantitat']]
        for mat in dades_feina.get('materials', []):
            data_table.append([mat['nom'], str(mat['q'])])
            
        t = Table(data_table, colWidths=[10*cm, 5*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4A5568")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#EDF2F7")),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        # Files de color altern (Zebra)
        for i in range(1, len(data_table)):
            if i % 2 == 0:
                bg_color = colors.white
            else:
                bg_color = colors.HexColor("#F7FAFC")
            t.setStyle(TableStyle([('BACKGROUND', (0, i), (-1, i), bg_color)]))

        elements.append(t)
        elements.append(Spacer(1, 2*cm))

        # Firmes
        elements.append(Paragraph("Firma Operari: ____________________  Firma Client: ____________________", self.styles['Normal']))

        # Generació
        doc.build(elements, onFirstPage=self.add_header_footer, onLaterPages=self.add_header_footer)
        
        pdf_value = buffer.getvalue()
        buffer.close()
        return pdf_value
```

## Exemple d'ús
En un handler o Celery task:
```python
generator = PDFReportGenerator(empresa_nom="AgroServeis SL")
dades = {
    'id': 'FT-2023-001',
    'client': 'Finca Mas Llobera',
    'materials': [{'nom': 'Hores Tractor', 'q': 4.5}, {'nom': 'Llitres Gasoil', 'q': 50}]
}
pdf_bytes = generator.generate_job_report(dades)

# Guarda-ho localment per comprovar o puja-ho a S3
with open("informe_sortida.pdf", "wb") as f:
    f.write(pdf_bytes)
```

## Validació
- Obre el PDF final i assegura't que l'espai i el color altern del format de taula es mostren correctament.
- Prova amb un nom de concepte molt llarg per veure si es produeix word-wrapping a la cel·la o si trenca l'alineació.

## Errors comuns
- Posar massa text sense el Paragraph i esperar wrap-around dins un array en Table() en ReportLab. Si el text d'una cel·la és llarg, utilitza `Paragraph('text llarg', self.styles['Normal'])` dins la llista en lloc d'un simple str.
- Oblidar usar una font compatible si escrius text amb accents/caràcters especials.
