package com.DigitalDairy.DigitalDairy.Utility;

import com.DigitalDairy.DigitalDairy.Entity.MilkCollection;
import com.DigitalDairy.DigitalDairy.Entity.PaymentEntity;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.util.stream.Stream;

@Component
public class InvoiceGenerator {

    public String generateInvoice(PaymentEntity payment) throws Exception {
        String fileName = "invoice_" + payment.getPaymentId() + ".pdf";
        String directory = "invoices";
        new File(directory).mkdirs(); // ensure folder exists
        String filePath = directory + "/" + fileName;

        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLUE);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);

        document.add(new Paragraph("Milk Payment Invoice", titleFont));
        document.add(new Paragraph("Invoice ID: " + payment.getPaymentId(), normalFont));
        document.add(new Paragraph("Payment Date: " + payment.getPaymentDate(), normalFont));
        document.add(new Paragraph("Payer ID: " + payment.getPayer().getUser_id(), normalFont));
        document.add(new Paragraph("Payer Name: " + payment.getPayer().getName(), normalFont));
        document.add(new Paragraph("Payee ID: " + payment.getPayee().getUser_id(), normalFont));
        document.add(new Paragraph("Payer ID: " + payment.getPayee().getName(), normalFont));
        document.add(new Paragraph("Payment For: " + payment.getPaymentFor(), normalFont));
        document.add(new Paragraph("Amount Paid: ₹" + payment.getAmount(), normalFont));
        document.add(new Paragraph("Payment Status: " + payment.getStatus(), normalFont));

        if (payment.getReferenceIds() != null && !payment.getReferenceIds().isEmpty()) {
            document.add(new Paragraph("Reference Collection IDs: " + payment.getReferenceIds(), normalFont));
        }

        document.close();
        return filePath;
    }
}

