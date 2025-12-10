'use client';

import { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

// ============================================================================
// OFFICIAL IRS W-2 FORM - COPY B (Employee's Federal Tax Return)
// ============================================================================
// Source: IRS Form W-2 (Rev. 2024) - https://www.irs.gov/pub/irs-pdf/fw2.pdf
// This template replicates Page 4 (Copy B) of the official IRS W-2 form
// 
// Typography: Courier/monospace font for data entry fields
// Layout: Official IRS box arrangement
// ============================================================================

// W-2 Form Data Interface
interface W2FormData {
  // Box a - Employee's SSN
  employeeSSN: string;
  
  // Box b - Employer's EIN
  employerEIN: string;
  
  // Box c - Employer info
  employerName: string;
  employerAddress: string;
  employerCityStateZip: string;
  
  // Box d - Control number
  controlNumber: string;
  
  // Box e - Employee name
  employeeName: string;
  
  // Box f - Employee address
  employeeAddress: string;
  employeeCityStateZip: string;
  
  // Numbered boxes 1-20
  box1: string;  // Wages, tips, other compensation
  box2: string;  // Federal income tax withheld
  box3: string;  // Social security wages
  box4: string;  // Social security tax withheld
  box5: string;  // Medicare wages and tips
  box6: string;  // Medicare tax withheld
  box7: string;  // Social security tips
  box8: string;  // Allocated tips
  box9: string;  // (blank)
  box10: string; // Dependent care benefits
  box11: string; // Nonqualified plans
  
  // Box 12a-d
  box12a_code: string;
  box12a_amount: string;
  box12b_code: string;
  box12b_amount: string;
  box12c_code: string;
  box12c_amount: string;
  box12d_code: string;
  box12d_amount: string;
  
  // Box 13 checkboxes
  box13_statutory: boolean;
  box13_retirement: boolean;
  box13_sickPay: boolean;
  
  // Box 14 - Other
  box14: string;
  
  // State/Local - Row 1
  box15_state1: string;
  box15_stateId1: string;
  box16_stateWages1: string;
  box17_stateTax1: string;
  box18_localWages1: string;
  box19_localTax1: string;
  box20_locality1: string;
  
  // State/Local - Row 2
  box15_state2: string;
  box15_stateId2: string;
  box16_stateWages2: string;
  box17_stateTax2: string;
  box18_localWages2: string;
  box19_localTax2: string;
  box20_locality2: string;
}

// Initial empty form data
const initialFormData: W2FormData = {
  employeeSSN: '',
  employerEIN: '',
  employerName: '',
  employerAddress: '',
  employerCityStateZip: '',
  controlNumber: '',
  employeeName: '',
  employeeAddress: '',
  employeeCityStateZip: '',
  box1: '',
  box2: '',
  box3: '',
  box4: '',
  box5: '',
  box6: '',
  box7: '',
  box8: '',
  box9: '',
  box10: '',
  box11: '',
  box12a_code: '',
  box12a_amount: '',
  box12b_code: '',
  box12b_amount: '',
  box12c_code: '',
  box12c_amount: '',
  box12d_code: '',
  box12d_amount: '',
  box13_statutory: false,
  box13_retirement: false,
  box13_sickPay: false,
  box14: '',
  box15_state1: '',
  box15_stateId1: '',
  box16_stateWages1: '',
  box17_stateTax1: '',
  box18_localWages1: '',
  box19_localTax1: '',
  box20_locality1: '',
  box15_state2: '',
  box15_stateId2: '',
  box16_stateWages2: '',
  box17_stateTax2: '',
  box18_localWages2: '',
  box19_localTax2: '',
  box20_locality2: '',
};

// Sample data for preview
const sampleFormData: W2FormData = {
  employeeSSN: '123-45-6789',
  employerEIN: '12-3456789',
  employerName: 'ACME CORPORATION',
  employerAddress: '1234 MAIN STREET',
  employerCityStateZip: 'ANYTOWN, CA 90210',
  controlNumber: '001234',
  employeeName: 'JOHN A SMITH',
  employeeAddress: '5678 OAK AVENUE APT 101',
  employeeCityStateZip: 'ANYTOWN, CA 90210',
  box1: '52000.00',
  box2: '5720.00',
  box3: '52000.00',
  box4: '3224.00',
  box5: '52000.00',
  box6: '754.00',
  box7: '',
  box8: '',
  box9: '',
  box10: '',
  box11: '',
  box12a_code: 'D',
  box12a_amount: '6000.00',
  box12b_code: 'DD',
  box12b_amount: '8500.00',
  box12c_code: '',
  box12c_amount: '',
  box12d_code: '',
  box12d_amount: '',
  box13_statutory: false,
  box13_retirement: true,
  box13_sickPay: false,
  box14: 'CA SDI 520.00',
  box15_state1: 'CA',
  box15_stateId1: '123-4567-8',
  box16_stateWages1: '52000.00',
  box17_stateTax1: '2340.00',
  box18_localWages1: '',
  box19_localTax1: '',
  box20_locality1: '',
  box15_state2: '',
  box15_stateId2: '',
  box16_stateWages2: '',
  box17_stateTax2: '',
  box18_localWages2: '',
  box19_localTax2: '',
  box20_locality2: '',
};

// Box 12 Codes Reference
const box12Codes: Record<string, string> = {
  'A': 'Uncollected social security or RRTA tax on tips',
  'B': 'Uncollected Medicare tax on tips',
  'C': 'Taxable cost of group-term life insurance over $50,000',
  'D': 'Elective deferrals under a section 401(k) cash or deferred arrangement',
  'E': 'Elective deferrals under a section 403(b) salary reduction agreement',
  'F': 'Elective deferrals under a section 408(k)(6) SARSEP',
  'G': 'Elective deferrals and employer contributions to section 457(b)',
  'H': 'Elective deferrals under section 501(c)(18)(D) tax-exempt plan',
  'J': 'Nontaxable sick pay',
  'K': '20% excise tax on excess golden parachute payments',
  'L': 'Substantiated employee business expense reimbursements',
  'M': 'Uncollected SS/RRTA tax on group-term life insurance (former employees)',
  'N': 'Uncollected Medicare tax on group-term life insurance (former employees)',
  'P': 'Excludable moving expense reimbursements (Armed Forces)',
  'Q': 'Nontaxable combat pay',
  'R': 'Employer contributions to Archer MSA',
  'S': 'Employee salary reduction contributions under section 408(p) SIMPLE',
  'T': 'Adoption benefits',
  'V': 'Income from exercise of nonstatutory stock option(s)',
  'W': 'Employer contributions to Health Savings Account (HSA)',
  'Y': 'Deferrals under section 409A nonqualified deferred compensation plan',
  'Z': 'Income under section 409A nonqualified deferred compensation plan',
  'AA': 'Designated Roth contributions under section 401(k) plan',
  'BB': 'Designated Roth contributions under section 403(b) plan',
  'DD': 'Cost of employer-sponsored health coverage',
  'EE': 'Designated Roth contributions under governmental 457(b) plan',
  'FF': 'Permitted benefits under QSEHRA',
  'GG': 'Income from qualified equity grants under section 83(i)',
  'HH': 'Aggregate deferrals under section 83(i) elections',
};

// Editable input component styled to match IRS form
const FormInput = ({ 
  value, 
  onChange, 
  className = '', 
  placeholder = '',
  maxLength,
  style = {},
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  style?: React.CSSProperties;
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    maxLength={maxLength}
    className={`w-full bg-transparent border-none outline-none font-mono text-black placeholder-gray-400 ${className}`}
    style={{ 
      fontSize: '10pt',
      padding: '0',
      margin: '0',
      ...style 
    }}
  />
);

// Checkbox component
const FormCheckbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="flex items-center gap-1 cursor-pointer" style={{ fontSize: '7pt' }}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-3 h-3 border-black"
    />
    <span>{label}</span>
  </label>
);

export default function W2TemplatePage() {
  const [formData, setFormData] = useState<W2FormData>(sampleFormData);
  const [copyType, setCopyType] = useState<'B' | '1'>('B');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Update form field
  const updateField = useCallback((field: keyof W2FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // Clear form
  const clearForm = () => {
    setFormData(initialFormData);
  };
  
  // Load sample data
  const loadSampleData = () => {
    setFormData(sampleFormData);
  };
  
  // Generate PDF
  const handleDownloadPDF = async () => {
    if (!formRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');
      
      // Capture the form element with type assertion for options
      const canvas = await html2canvas(formRef.current, {
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: formRef.current.scrollWidth * 2,
        windowHeight: formRef.current.scrollHeight * 2,
      } as any);
      
      // Create PDF (W-2 is typically half-page, so we use custom size)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [8.5, 5.5], // Half letter size
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 8;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0.25, 0.25, imgWidth, imgHeight);
      
      // Save PDF
      const fileName = `W2_${formData.employeeName.replace(/\s+/g, '_') || 'Form'}_${copyType === 'B' ? 'CopyB' : 'Copy1'}_2024.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // Print form only
  const handlePrint = () => {
    const printContent = formRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Form W-2 - Copy ${copyType}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', Courier, monospace; }
            @page { size: 8.5in 5.5in; margin: 0.25in; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Get copy description
  const getCopyInfo = (type: 'B' | '1') => {
    if (type === 'B') {
      return {
        title: 'Copy B',
        subtitle: "To Be Filed With Employee's FEDERAL Tax Return.",
        instruction: 'This information is being furnished to the Internal Revenue Service.',
      };
    }
    return {
      title: 'Copy 1',
      subtitle: 'For State, City, or Local Tax Department',
      instruction: '',
    };
  };
  
  const copyInfo = getCopyInfo(copyType);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/documents" className="hover:text-blue-600">Documents</a>
            <span className="mx-2">/</span>
            <a href="/documents/templates" className="hover:text-blue-600">Templates</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Form W-2</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form W-2 — Wage and Tax Statement</h1>
              <p className="text-gray-600 mt-1">
                Editable template matching official IRS format • Tax Year 2024
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={clearForm}>
                Clear Form
              </Button>
              <Button variant="outline" onClick={loadSampleData}>
                Load Sample
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>

        {/* Copy Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-gray-700">Select Copy Type:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="copyType"
                value="B"
                checked={copyType === 'B'}
                onChange={() => setCopyType('B')}
                className="w-4 h-4"
              />
              <span><strong>Copy B</strong> — Employee's Federal Tax Return</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="copyType"
                value="1"
                checked={copyType === '1'}
                onChange={() => setCopyType('1')}
                className="w-4 h-4"
              />
              <span><strong>Copy 1</strong> — State/City/Local Tax Department</span>
            </label>
          </div>
        </div>

        {/* W-2 Form - Official IRS Layout */}
        <div className="flex justify-center overflow-x-auto">
          <div 
            ref={formRef}
            className="bg-white shadow-lg"
            style={{ 
              width: '8in',
              minHeight: '5in',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '9pt',
              color: '#000',
              padding: '0.2in',
              border: '1px solid #000',
            }}
          >
            {/* Form Header Row */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              borderBottom: '2px solid #000',
              paddingBottom: '3px',
              marginBottom: '0',
            }}>
              {/* Left side - Control number area */}
              <div style={{ fontSize: '7pt' }}>
                <span style={{ fontWeight: 'bold' }}>22222</span>
                <span style={{ marginLeft: '20px', fontSize: '6pt', color: '#666' }}>
                  Void ☐
                </span>
              </div>
              
              {/* Center - Form title */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '7pt' }}>
                  Form <span style={{ fontSize: '14pt', fontWeight: 'bold' }}>W-2</span> Wage and Tax Statement
                </div>
                <div style={{ fontSize: '7pt', fontWeight: 'bold' }}>2024</div>
              </div>
              
              {/* Right side - Copy info */}
              <div style={{ textAlign: 'right', maxWidth: '180px' }}>
                <div style={{ fontSize: '12pt', fontWeight: 'bold' }}>{copyInfo.title}</div>
                <div style={{ fontSize: '7pt' }}>{copyInfo.subtitle}</div>
              </div>
            </div>

            {/* Main Form Body - Two Column Layout */}
            <div style={{ display: 'flex', border: '1px solid #000', borderTop: 'none' }}>
              
              {/* LEFT COLUMN - Employee/Employer Info (Boxes a-f) */}
              <div style={{ width: '50%', borderRight: '1px solid #000' }}>
                
                {/* Box a - Employee's SSN */}
                <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                  <div style={{ fontSize: '6pt', color: '#333' }}>a Employee's social security number</div>
                  <FormInput 
                    value={formData.employeeSSN}
                    onChange={(v) => updateField('employeeSSN', v)}
                    placeholder="XXX-XX-XXXX"
                    style={{ fontSize: '12pt', fontWeight: 'bold', letterSpacing: '1px' }}
                  />
                </div>
                
                {/* Box b - Employer's EIN */}
                <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                  <div style={{ fontSize: '6pt', color: '#333' }}>b Employer identification number (EIN)</div>
                  <FormInput 
                    value={formData.employerEIN}
                    onChange={(v) => updateField('employerEIN', v)}
                    placeholder="XX-XXXXXXX"
                    style={{ fontSize: '10pt' }}
                  />
                </div>
                
                {/* Box c - Employer's name, address */}
                <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '60px' }}>
                  <div style={{ fontSize: '6pt', color: '#333' }}>c Employer's name, address, and ZIP code</div>
                  <FormInput 
                    value={formData.employerName}
                    onChange={(v) => updateField('employerName', v)}
                    placeholder="Employer name"
                    style={{ fontSize: '9pt', marginBottom: '2px' }}
                  />
                  <FormInput 
                    value={formData.employerAddress}
                    onChange={(v) => updateField('employerAddress', v)}
                    placeholder="Street address"
                    style={{ fontSize: '9pt', marginBottom: '2px' }}
                  />
                  <FormInput 
                    value={formData.employerCityStateZip}
                    onChange={(v) => updateField('employerCityStateZip', v)}
                    placeholder="City, State ZIP"
                    style={{ fontSize: '9pt' }}
                  />
                </div>
                
                {/* Box d - Control number */}
                <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '28px' }}>
                  <div style={{ fontSize: '6pt', color: '#333' }}>d Control number</div>
                  <FormInput 
                    value={formData.controlNumber}
                    onChange={(v) => updateField('controlNumber', v)}
                    placeholder=""
                    style={{ fontSize: '9pt' }}
                  />
                </div>
                
                {/* Box e - Employee's name */}
                <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                  <div style={{ fontSize: '6pt', color: '#333' }}>e Employee's first name and initial &nbsp;&nbsp;&nbsp; Last name &nbsp;&nbsp;&nbsp; Suff.</div>
                  <FormInput 
                    value={formData.employeeName}
                    onChange={(v) => updateField('employeeName', v)}
                    placeholder="FIRST M LAST"
                    style={{ fontSize: '10pt' }}
                  />
                </div>
                
                {/* Box f - Employee's address */}
                <div style={{ padding: '2px 4px', minHeight: '50px' }}>
                  <div style={{ fontSize: '6pt', color: '#333' }}>f Employee's address and ZIP code</div>
                  <FormInput 
                    value={formData.employeeAddress}
                    onChange={(v) => updateField('employeeAddress', v)}
                    placeholder="Street address"
                    style={{ fontSize: '9pt', marginBottom: '2px' }}
                  />
                  <FormInput 
                    value={formData.employeeCityStateZip}
                    onChange={(v) => updateField('employeeCityStateZip', v)}
                    placeholder="City, State ZIP"
                    style={{ fontSize: '9pt' }}
                  />
                </div>
              </div>
              
              {/* RIGHT COLUMN - Wage/Tax Boxes (1-14) */}
              <div style={{ width: '50%' }}>
                
                {/* Row: Boxes 1 and 2 */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>1 Wages, tips, other compensation</div>
                    <FormInput 
                      value={formData.box1}
                      onChange={(v) => updateField('box1', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>2 Federal income tax withheld</div>
                    <FormInput 
                      value={formData.box2}
                      onChange={(v) => updateField('box2', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                </div>
                
                {/* Row: Boxes 3 and 4 */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>3 Social security wages</div>
                    <FormInput 
                      value={formData.box3}
                      onChange={(v) => updateField('box3', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>4 Social security tax withheld</div>
                    <FormInput 
                      value={formData.box4}
                      onChange={(v) => updateField('box4', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                </div>
                
                {/* Row: Boxes 5 and 6 */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>5 Medicare wages and tips</div>
                    <FormInput 
                      value={formData.box5}
                      onChange={(v) => updateField('box5', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>6 Medicare tax withheld</div>
                    <FormInput 
                      value={formData.box6}
                      onChange={(v) => updateField('box6', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                </div>
                
                {/* Row: Boxes 7 and 8 */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>7 Social security tips</div>
                    <FormInput 
                      value={formData.box7}
                      onChange={(v) => updateField('box7', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>8 Allocated tips</div>
                    <FormInput 
                      value={formData.box8}
                      onChange={(v) => updateField('box8', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                </div>
                
                {/* Row: Boxes 9 and 10 */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>9</div>
                    {/* Box 9 is reserved/blank */}
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>10 Dependent care benefits</div>
                    <FormInput 
                      value={formData.box10}
                      onChange={(v) => updateField('box10', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                </div>
                
                {/* Row: Boxes 11 and 12a */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>11 Nonqualified plans</div>
                    <FormInput 
                      value={formData.box11}
                      onChange={(v) => updateField('box11', v)}
                      placeholder=""
                      style={{ fontSize: '10pt', textAlign: 'right' }}
                    />
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '32px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>12a See instructions for box 12</div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{ border: '1px solid #000', width: '24px', textAlign: 'center' }}>
                        <FormInput 
                          value={formData.box12a_code}
                          onChange={(v) => updateField('box12a_code', v.toUpperCase())}
                          maxLength={2}
                          style={{ fontSize: '9pt', textAlign: 'center', width: '20px' }}
                        />
                      </div>
                      <FormInput 
                        value={formData.box12a_amount}
                        onChange={(v) => updateField('box12a_amount', v)}
                        placeholder=""
                        style={{ fontSize: '9pt', textAlign: 'right', flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Row: Boxes 13 and 12b */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '40px' }}>
                    <div style={{ fontSize: '6pt', color: '#333', marginBottom: '2px' }}>13</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <FormCheckbox 
                        checked={formData.box13_statutory}
                        onChange={(v) => updateField('box13_statutory', v)}
                        label="Statutory employee"
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <FormCheckbox 
                          checked={formData.box13_retirement}
                          onChange={(v) => updateField('box13_retirement', v)}
                          label="Retirement plan"
                        />
                        <FormCheckbox 
                          checked={formData.box13_sickPay}
                          onChange={(v) => updateField('box13_sickPay', v)}
                          label="Third-party sick pay"
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '50%', borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '40px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>12b</div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{ border: '1px solid #000', width: '24px', textAlign: 'center' }}>
                        <FormInput 
                          value={formData.box12b_code}
                          onChange={(v) => updateField('box12b_code', v.toUpperCase())}
                          maxLength={2}
                          style={{ fontSize: '9pt', textAlign: 'center', width: '20px' }}
                        />
                      </div>
                      <FormInput 
                        value={formData.box12b_amount}
                        onChange={(v) => updateField('box12b_amount', v)}
                        placeholder=""
                        style={{ fontSize: '9pt', textAlign: 'right', flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Row: Boxes 14 and 12c/12d */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%', borderRight: '1px solid #000', padding: '2px 4px', minHeight: '50px' }}>
                    <div style={{ fontSize: '6pt', color: '#333' }}>14 Other</div>
                    <textarea
                      value={formData.box14}
                      onChange={(e) => updateField('box14', e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-mono text-black resize-none"
                      style={{ fontSize: '8pt', height: '36px' }}
                      placeholder="Additional info"
                    />
                  </div>
                  <div style={{ width: '50%' }}>
                    <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', minHeight: '25px' }}>
                      <div style={{ fontSize: '6pt', color: '#333' }}>12c</div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <div style={{ border: '1px solid #000', width: '24px', textAlign: 'center' }}>
                          <FormInput 
                            value={formData.box12c_code}
                            onChange={(v) => updateField('box12c_code', v.toUpperCase())}
                            maxLength={2}
                            style={{ fontSize: '9pt', textAlign: 'center', width: '20px' }}
                          />
                        </div>
                        <FormInput 
                          value={formData.box12c_amount}
                          onChange={(v) => updateField('box12c_amount', v)}
                          placeholder=""
                          style={{ fontSize: '9pt', textAlign: 'right', flex: 1 }}
                        />
                      </div>
                    </div>
                    <div style={{ padding: '2px 4px', minHeight: '25px' }}>
                      <div style={{ fontSize: '6pt', color: '#333' }}>12d</div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <div style={{ border: '1px solid #000', width: '24px', textAlign: 'center' }}>
                          <FormInput 
                            value={formData.box12d_code}
                            onChange={(v) => updateField('box12d_code', v.toUpperCase())}
                            maxLength={2}
                            style={{ fontSize: '9pt', textAlign: 'center', width: '20px' }}
                          />
                        </div>
                        <FormInput 
                          value={formData.box12d_amount}
                          onChange={(v) => updateField('box12d_amount', v)}
                          placeholder=""
                          style={{ fontSize: '9pt', textAlign: 'right', flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* State and Local Tax Section (Boxes 15-20) */}
            <div style={{ border: '1px solid #000', borderTop: 'none' }}>
              {/* Headers */}
              <div style={{ display: 'flex', borderBottom: '1px solid #000', fontSize: '6pt', color: '#333' }}>
                <div style={{ width: '8%', borderRight: '1px solid #000', padding: '1px 2px' }}>15 State</div>
                <div style={{ width: '17%', borderRight: '1px solid #000', padding: '1px 2px' }}>Employer's state ID number</div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>16 State wages, tips, etc.</div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>17 State income tax</div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>18 Local wages, tips, etc.</div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>19 Local income tax</div>
                <div style={{ width: '15%', padding: '1px 2px' }}>20 Locality name</div>
              </div>
              
              {/* State/Local Row 1 */}
              <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
                <div style={{ width: '8%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box15_state1}
                    onChange={(v) => updateField('box15_state1', v.toUpperCase())}
                    maxLength={2}
                    style={{ fontSize: '9pt' }}
                  />
                </div>
                <div style={{ width: '17%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box15_stateId1}
                    onChange={(v) => updateField('box15_stateId1', v)}
                    style={{ fontSize: '9pt' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box16_stateWages1}
                    onChange={(v) => updateField('box16_stateWages1', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box17_stateTax1}
                    onChange={(v) => updateField('box17_stateTax1', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box18_localWages1}
                    onChange={(v) => updateField('box18_localWages1', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box19_localTax1}
                    onChange={(v) => updateField('box19_localTax1', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box20_locality1}
                    onChange={(v) => updateField('box20_locality1', v)}
                    style={{ fontSize: '9pt' }}
                  />
                </div>
              </div>
              
              {/* State/Local Row 2 */}
              <div style={{ display: 'flex' }}>
                <div style={{ width: '8%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box15_state2}
                    onChange={(v) => updateField('box15_state2', v.toUpperCase())}
                    maxLength={2}
                    style={{ fontSize: '9pt' }}
                  />
                </div>
                <div style={{ width: '17%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box15_stateId2}
                    onChange={(v) => updateField('box15_stateId2', v)}
                    style={{ fontSize: '9pt' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box16_stateWages2}
                    onChange={(v) => updateField('box16_stateWages2', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box17_stateTax2}
                    onChange={(v) => updateField('box17_stateTax2', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box18_localWages2}
                    onChange={(v) => updateField('box18_localWages2', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', borderRight: '1px solid #000', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box19_localTax2}
                    onChange={(v) => updateField('box19_localTax2', v)}
                    style={{ fontSize: '9pt', textAlign: 'right' }}
                  />
                </div>
                <div style={{ width: '15%', padding: '1px 2px' }}>
                  <FormInput 
                    value={formData.box20_locality2}
                    onChange={(v) => updateField('box20_locality2', v)}
                    style={{ fontSize: '9pt' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Form Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '6pt', 
              color: '#333',
              marginTop: '4px',
              paddingTop: '2px',
              borderTop: '1px solid #000',
            }}>
              <div>Form W-2 Wage and Tax Statement 2024</div>
              <div>Department of the Treasury—Internal Revenue Service</div>
              <div>{copyInfo.title}—{copyInfo.subtitle}</div>
            </div>
            
            {/* Copy B instruction notice */}
            {copyType === 'B' && (
              <div style={{ 
                fontSize: '7pt', 
                marginTop: '8px', 
                padding: '4px',
                border: '1px solid #000',
                backgroundColor: '#f9f9f9',
              }}>
                <strong>Notice to Employee:</strong> Do you have to file? Refer to the Form 1040 instructions. 
                If you are required to file a tax return, include this copy with your federal tax return. 
                This information is being furnished to the Internal Revenue Service. 
                If you file your return electronically, do not send this form to the IRS.
              </div>
            )}
          </div>
        </div>

        {/* Box 12 Code Reference */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Box 12 Code Reference</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter one of these codes in the Box 12 code fields to identify special compensation or benefits:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {Object.entries(box12Codes).slice(0, 14).map(([code, description]) => (
              <div key={code} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="font-mono font-bold text-blue-600 w-6 flex-shrink-0">{code}</span>
                <span className="text-gray-700 text-xs">{description}</span>
              </div>
            ))}
          </div>
          
          <details className="mt-4">
            <summary className="text-blue-600 cursor-pointer hover:underline text-sm">View all Box 12 codes</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
              {Object.entries(box12Codes).slice(14).map(([code, description]) => (
                <div key={code} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <span className="font-mono font-bold text-blue-600 w-8 flex-shrink-0">{code}</span>
                  <span className="text-gray-700 text-xs">{description}</span>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* FAFSA Tips */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-green-800 mb-3">
            📋 Using Your W-2 for FAFSA
          </h2>
          <ul className="text-sm text-green-700 space-y-2">
            <li><strong>Box 1</strong> — Your total wages/salary for income reporting</li>
            <li><strong>Box 2</strong> — Federal taxes withheld (verify against tax return)</li>
            <li><strong>Box 12 Code D/E</strong> — 401(k) or 403(b) contributions (may affect income calculation)</li>
            <li><strong>Box 12 Code DD</strong> — Health insurance cost (informational only)</li>
          </ul>
          <p className="mt-3 text-sm text-green-600">
            💡 <strong>Tip:</strong> Use the IRS Data Retrieval Tool when filing your FAFSA to automatically import tax information.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
