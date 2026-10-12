import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { FileText, Download, Stethoscope, Calendar, Pill, Printer } from 'lucide-react';
import api from '../../services/api';
import { Prescription } from '../../types';

// Dynamically import jsPDF to avoid SSR issues
const exportPrescriptionToPdf = async (pres: Prescription) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // ─── Header Banner ───────────────────────────────────────────────────────────
  doc.setFillColor(2, 132, 199);
  doc.rect(0, 0, pageWidth, 38, 'F');
  doc.setFillColor(13, 148, 136);
  doc.rect(0, 34, pageWidth, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('🏥 MediCare Digital Clinic', margin, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized Online Healthcare Management Platform', margin, 24);
  doc.text(`Rx #${pres.id} · Issued: ${pres.issuedDate}`, margin, 31);

  // ─── Doctor Info (right side of header) ──────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dr. ${pres.doctor.user.fullName}`, pageWidth - margin, 12, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(pres.doctor.specialization, pageWidth - margin, 18, { align: 'right' });
  doc.text(pres.doctor.qualification, pageWidth - margin, 23, { align: 'right' });

  let y = 50;

  // ─── Patient Info Box ─────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const patientInfo = [
    ['Patient Name', pres.patient.user.fullName],
    ['Gender / DOB',  `${pres.patient.gender || 'N/A'} / ${pres.patient.dateOfBirth || 'N/A'}`],
    ['Blood Group',   pres.patient.bloodGroup || 'N/A'],
  ];
  patientInfo.forEach(([label, value], i) => {
    const col = Math.floor(i / 2);
    const row = i % 2;
    const x = margin + 5 + col * (contentWidth / 2);
    const rowY = y + 13 + row * 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${label}:`, x, rowY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + 30, rowY);
  });

  y += 34;

  // ─── Diagnosis ────────────────────────────────────────────────────────────────
  doc.setFillColor(224, 242, 254);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F');
  doc.setTextColor(2, 100, 164);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CLINICAL DIAGNOSIS', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(2, 58, 100);
  doc.text(pres.diagnosis, margin + 5, y + 14);

  y += 26;

  // ─── Medicines ────────────────────────────────────────────────────────────────
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Rx  Prescribed Medication:', margin, y);
  y += 4;

  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const medicineLines = doc.splitTextToSize(pres.medicines, contentWidth);
  doc.text(medicineLines, margin, y);
  y += medicineLines.length * 5.5 + 6;

  // ─── Instructions ─────────────────────────────────────────────────────────────
  if (pres.instructions) {
    doc.setFillColor(255, 251, 235);
    const instrLines = doc.splitTextToSize(pres.instructions, contentWidth - 10);
    const instrHeight = instrLines.length * 5.5 + 14;

    doc.roundedRect(margin, y, contentWidth, instrHeight, 3, 3, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin, y + instrHeight);

    doc.setTextColor(120, 80, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ADVICE / SPECIAL INSTRUCTIONS', margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(69, 40, 0);
    doc.text(instrLines, margin + 5, y + 14);
    y += instrHeight + 8;
  }

  // ─── Doctor Signature ─────────────────────────────────────────────────────────
  y = Math.max(y, 230);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - margin - 60, y, pageWidth - margin, y);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text(`Dr. ${pres.doctor.user.fullName}`, pageWidth - margin, y + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(pres.doctor.specialization, pageWidth - margin, y + 10, { align: 'right' });

  // ─── Footer ──────────────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 282, pageWidth, 15, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated by MediCare · ${new Date().toLocaleDateString('en-IN')} · This is a computer-generated prescription.`,
    pageWidth / 2,
    289,
    { align: 'center' }
  );

  doc.save(`prescription-${pres.id}-${pres.patient.user.fullName.replace(/\s+/g, '_')}.pdf`);
};

export const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [exporting, setExporting] = useState<number | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('/prescriptions/my');
      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePdfExport = async (pres: Prescription) => {
    setExporting(pres.id);
    try {
      await exportPrescriptionToPdf(pres);
    } finally {
      setExporting(null);
    }
  };

  return (
    <Layout title="Digital Prescriptions" subtitle="View, print, and export your medical prescriptions as PDF">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {prescriptions.map((pres) => (
          <div key={pres.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0d9488', backgroundColor: 'var(--secondary-light)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    RX PRESCRIPTION #{pres.id}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{pres.diagnosis}</h3>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{pres.issuedDate}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Prescribed by:</div>
                <div style={{ fontSize: '14px', color: '#0284c7', fontWeight: 600 }}>Dr. {pres.doctor.user.fullName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{pres.doctor.specialization} ({pres.doctor.qualification})</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Pill size={14} color="#0d9488" /> Prescribed Medicines:
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                  {pres.medicines}
                </p>
              </div>

              {pres.instructions && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px' }}>
                  <strong>Doctor Instructions:</strong> "{pres.instructions}"
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSelectedPrescription(pres)} className="btn btn-outline" style={{ flex: 1 }}>
                <FileText size={16} /> View
              </button>
              <button
                onClick={() => handlePdfExport(pres)}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={exporting === pres.id}
              >
                <Download size={16} />
                {exporting === pres.id ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {prescriptions.length === 0 && (
        <div className="card empty-state">
          <FileText className="empty-state-icon" size={48} />
          <h3>No prescriptions issued yet</h3>
          <p>Prescriptions issued by doctors after completed consultations will appear here.</p>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="#0284c7" /> Official Medical Prescription
              </h3>
              <button onClick={() => setSelectedPrescription(null)} style={{ border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div className="modal-body" id="printable-prescription">
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0284c7', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>MediCare Digital Clinic</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Authorized Health Management Platform</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7' }}>Dr. {selectedPrescription.doctor.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedPrescription.doctor.qualification}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedPrescription.doctor.specialization}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ color: 'var(--text-primary)' }}><strong>Patient Name:</strong> {selectedPrescription.patient.user.fullName}</div>
                <div style={{ color: 'var(--text-primary)' }}><strong>Date:</strong> {selectedPrescription.issuedDate}</div>
                <div style={{ color: 'var(--text-primary)' }}><strong>Gender / DOB:</strong> {selectedPrescription.patient.gender || 'N/A'} ({selectedPrescription.patient.dateOfBirth || 'N/A'})</div>
                <div style={{ color: 'var(--text-primary)' }}><strong>Blood Group:</strong> {selectedPrescription.patient.bloodGroup || 'N/A'}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Clinical Diagnosis:</h4>
                <div style={{ fontSize: '15px', color: '#0369a1', fontWeight: 600 }}>{selectedPrescription.diagnosis}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} color="#0d9488" /> Rx Prescribed Medication:
                </h4>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {selectedPrescription.medicines}
                </div>
              </div>

              {selectedPrescription.instructions && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Advice / Special Instructions:</h4>
                  <p style={{ fontSize: '13px', color: '#475569', backgroundColor: '#fffbeb', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                    {selectedPrescription.instructions}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={handlePrint} className="btn btn-outline">
                <Printer size={16} /> Print
              </button>
              <button
                onClick={() => handlePdfExport(selectedPrescription)}
                className="btn btn-primary"
                disabled={exporting === selectedPrescription.id}
              >
                <Download size={16} />
                {exporting === selectedPrescription.id ? 'Exporting...' : 'Download PDF'}
              </button>
              <button onClick={() => setSelectedPrescription(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
