import jsPDF from 'jspdf';
import type { Itinerary } from '@shared/schema';

export function generatePDF(itinerary: Itinerary) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246); // Blue color
  const titleLines = wrapText(itinerary.title, contentWidth, 24);
  pdf.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 12 + 10;

  // Trip Overview
  checkPageBreak(60);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Trip Overview', margin, yPosition);
  yPosition += 20;

  // Overview details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const overviewItems = [
    `Destination: ${itinerary.destination}`,
    `Duration: ${itinerary.duration}`,
    `Budget: ${itinerary.budget}`,
    `Travel Type: ${itinerary.travelType}`
  ];

  overviewItems.forEach(item => {
    checkPageBreak(15);
    pdf.text(item, margin, yPosition);
  yPosition += 15;
  });

  // Highlights
  if (itinerary.highlights && itinerary.highlights.length > 0) {
    yPosition += 10;
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Trip Highlights', margin, yPosition);
    yPosition += 20;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    itinerary.highlights.forEach(highlight => {
      checkPageBreak(12);
      pdf.text(`• ${highlight}`, margin + 5, yPosition);
      yPosition += 12;
    });
  }

  // Detailed Itinerary
  yPosition += 20;
  checkPageBreak(30);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('Detailed Itinerary', margin, yPosition);
  yPosition += 25;

  // Days
  itinerary.days.forEach((day, dayIndex) => {
    checkPageBreak(80);
    
    // Day header
    pdf.setFillColor(59, 130, 246);
    pdf.rect(margin, yPosition - 5, contentWidth, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Day ${day.day}`, margin + 10, yPosition + 10);
    
    pdf.setFontSize(14);
    pdf.text(day.title, margin + 60, yPosition + 10);
    yPosition += 35;

    // Activities
    day.activities.forEach((activity, activityIndex) => {
      checkPageBreak(60);
      
      // Activity time badge
      pdf.setFillColor(243, 244, 246);
      pdf.setDrawColor(209, 213, 219);
      pdf.roundedRect(margin, yPosition - 3, 50, 16, 3, 3, 'FD');
      
      pdf.setTextColor(75, 85, 99);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(activity.time, margin + 25 - (activity.time.length * 1.2), yPosition + 8);

      // Activity title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      const titleLines = wrapText(activity.title, contentWidth - 60, 13);
      pdf.text(titleLines, margin + 60, yPosition + 8);
      yPosition += Math.max(16, titleLines.length * 8) + 5;

      // Activity type badge
      pdf.setFillColor(219, 234, 254);
      pdf.setDrawColor(147, 197, 253);
      const typeText = activity.type.charAt(0).toUpperCase() + activity.type.slice(1);
      const typeWidth = pdf.getTextWidth(typeText) + 10;
      pdf.roundedRect(margin + 60, yPosition - 3, typeWidth, 12, 2, 2, 'FD');
      
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(typeText, margin + 65, yPosition + 5);
      yPosition += 18;

      // Activity description
      pdf.setTextColor(75, 85, 99);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const descLines = wrapText(activity.description, contentWidth - 60, 11);
      pdf.text(descLines, margin + 60, yPosition);
      yPosition += descLines.length * 8 + 8;

      // Activity details (if available)
      if (activity.details) {
        checkPageBreak(30);
        
        // Details box background
        const detailsLines = wrapText(activity.details, contentWidth - 80, 10);
        const boxHeight = detailsLines.length * 7 + 10;
        
        pdf.setFillColor(249, 250, 251);
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(margin + 60, yPosition - 5, contentWidth - 60, boxHeight, 'FD');
        
        // Details label
        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('More Details:', margin + 65, yPosition + 5);
        
        // Details text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detailsLines, margin + 65, yPosition + 15);
        yPosition += boxHeight + 5;
      }

      yPosition += 10;
    });

    yPosition += 15;
  });

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
  pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
  pdf.text(
      `Generated by PlanMyTrip AI • Page ${i} of ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
      { align: 'center' }
  );
}

  // Save the PDF
  const filename = `${itinerary.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`;
  pdf.save(filename);
}