
// Šis komponentas rodo PDF generavimą naudojant html2canvas ir jsPDF
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PDFExportWrapper({ children, pilotCode = "XXX", opcDate = "20250517" }) {
  const exportRef = useRef();

  const generatePDF = () => {
    const input = exportRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      const filename = `${pilotCode} OPC ${opcDate}.pdf`;
      pdf.save(filename);
    });
  };

  return (
    <div className="space-y-4">
      <div ref={exportRef}>{children}</div>
      <button
        onClick={generatePDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate PDF
      </button>
    </div>
  );
}

export default PDFExportWrapper;
