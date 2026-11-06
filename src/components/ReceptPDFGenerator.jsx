import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';


export default function ReceptPDFGenerator({ recept, sviSastojci }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url)

        if (!response.ok) { throw new Error(`Font nije pronađen: ${url}`) }
        const blob = await response.blob()
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result.split(',')[1])
            reader.readAsDataURL(blob)
        })
    }

    const generirajPDF = async () => {
       // const pdfWindow = window.open('', '_blank')

        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ])

        const doc = new jsPDF()

        doc.addFileToVFS('Roboto-Regular.ttf', regBase64)
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64)
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold')

        const primaryColor = [53, 72, 59];
        const secondaryColor = [120, 120, 120];
        const textColor = [40, 40, 40];

        // NASLOV
        doc.setFont('Roboto', 'bold')
        doc.setFontSize(22)
        doc.setTextColor(...primaryColor)
        doc.text('PRIRUČNA KUHARICA', 15, 20)

        doc.setFont('Roboto', 'normal')
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text('RECEPTI I KULINARSKI VODIČ', 15, 26)


        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.8);
        doc.line(15, 30, 195, 30);

        // NAZIV RECEPTA
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...textColor);
        doc.text(`Recept: ${recept?.naziv || '-'}`, 15, 42)

        // PODACI O RECEPTU
        autoTable(doc, {
            startY: 50,
            margin: { left: 15, right: 15 },
            theme: 'plain',
            styles: { font: 'Roboto', fontSize: 10, textColor: textColor, cellPadding: 3 },

            head: [['PODACI O RECEPTU']],
            body: [
                [`Kategorija: ${recept?.kategorija || '-'}`],
                [`Vrijeme pripreme: ${recept?.vrijeme || '-'}`],
                [`Veganski recept: ${recept?.vegansko ? 'Da' : 'Ne'}`],
                [`Omiljeni recept: ${recept?.omiljen ? 'Da' : 'Ne'}`]
            ],
            headStyles: {
                fillColor: [241, 245, 249],
                textColor: primaryColor,
                fontStyle: 'bold'
            }
        })

        let currentY = doc.lastAutoTable.finalY + 10;

        // OPIS RECEPTA
        if (recept?.opis) {
            doc.setFont('Roboto', 'bold')
            doc.setFontSize(13)
            doc.setTextColor(...textColor)
            doc.text('Opis recepta', 15, currentY)

            currentY += 7

            doc.setFont('Roboto', 'normal')
            doc.setFontSize(10);

            const opis = doc.splitTextToSize(recept.opis, 180)
            doc.text(opis, 15, currentY)
            currentY += opis.length * 5 + 8
        }

        // SASTOJCI
        doc.setFont('Roboto', 'bold')
        doc.setFontSize(13)
        doc.setTextColor(...textColor)

        doc.text('Sastojci', 15, currentY)
        currentY += 5

        const sastojci = recept?.sastojci || []
        const tableData = sastojci.map((s, index) => {
            const podatakSastojka = sviSastojci?.find(
                item => Number(item.id) === Number(s.sastojak)
            )
            return [index + 1, podatakSastojka?.naziv || 'Nepoznato',
            s.kolicina ?? '-', s.jedMjere || '-']
        })

        if (tableData.length > 0) {
            autoTable(doc, {
                startY: currentY, margin: { left: 15, right: 15 },
                head: [['#', 'Naziv sastojka', 'Količina', 'Jedinica mjere']],
                body: tableData,
                styles: {
                    font: 'Roboto', fontSize: 10, textColor: textColor, cellPadding: 4
                },
                headStyles: {
                    font: 'Roboto', fontStyle: 'bold', fillColor: primaryColor,
                    textColor: [255, 255, 255]
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                columnStyles: {
                    0: { cellWidth: 12, halign: 'center' },
                    1: { cellWidth: 85 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 45 }
                }
            })
        } else {
            doc.setFont('Roboto', 'normal')
            doc.setFontSize(10)
            doc.text('Nema unesenih sastojaka', 15, currentY + 7)
        }
        currentY = doc.lastAutoTable?.finalY
            ? doc.lastAutoTable.finalY + 12
            : currentY + 15

        // PRIPREMA
        const priprema = recept?.priprema || recept?.opis
        if (priprema) {
            if (sastojci.length > 6) {
                doc.addPage()
                currentY = 20
            }
            doc.setFont('Roboto', 'bold')
            doc.setFontSize(13)
            doc.setTextColor(...textColor)
            doc.text('Način pripreme', 15, currentY)
            currentY += 7
            doc.setFont('Roboto', 'normal')
            doc.setFontSize(10)

            const tekstPripreme = doc.splitTextToSize(priprema, 180)

            // Automatski prijelaz na novu stranicu
            if (currentY + tekstPripreme.length * 5 > 270) {
                doc.addPage()
                currentY = 20
            }
            doc.text(tekstPripreme, 15, currentY)
        }
        // PODNOŽJE STRANICE
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setDrawColor(226, 232, 240)
            doc.setLineWidth(0.4)
            doc.line(15, doc.internal.pageSize.getHeight() - 15, 195,
                doc.internal.pageSize.getHeight() - 15)
            doc.setFont('Roboto', 'normal')
            doc.setTextColor(...secondaryColor)

            doc.text(`Generirano: ${new Date().toLocaleString('hr-HR')}`, 15,
                doc.internal.pageSize.getHeight() - 8)
            doc.text(`Stranica ${i} od ${pageCount}`,
                doc.internal.pageSize.getWidth() - 15,
                doc.internal.pageSize.getHeight() - 8, { align: 'right' }
            )
        }
        // OTVARANJE PDF-a
  
         const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');

    }
    return generirajPDF
    }