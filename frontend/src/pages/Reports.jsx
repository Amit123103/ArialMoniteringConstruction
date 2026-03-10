import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const [captures, setCaptures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/captures');
                setCaptures(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExport = () => {
        if (captures.length === 0) {
            toast.error("No telemetry data available for export.");
            return;
        }

        toast.success("Generating Executive PDF Report...");

        const doc = new jsPDF();

        // Header
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(245, 158, 11); // amber-500
        doc.setFontSize(24);
        doc.text('AERIALPM', 14, 20);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('EXECUTIVE PROGRESS REPORT', 14, 30);

        // Metadata
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 50);
        doc.text(`Total Captures: ${captures.length}`, 14, 56);

        // Table Data
        const tableColumn = ["Date", "Project", "Phase", "Workers", "Machinery", "AI Score"];
        const tableRows = [];

        captures.forEach(capture => {
            const date = new Date(capture.captured_at).toLocaleDateString();
            const project = capture.project_name || 'Unknown';
            const phase = capture.phase || 'N/A';
            const cv = capture.cv_data || {};
            const workers = cv.workerCount?.toString() || '0';
            const machinery = cv.machineCount?.toString() || '0';
            const score = cv.score?.toString() || 'N/A';

            tableRows.push([date, project, phase, workers, machinery, score]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            theme: 'grid',
            headStyles: { fillColor: [245, 158, 11], textColor: [15, 23, 42], fontStyle: 'bold' },
            styles: { font: 'courier', fontSize: 9 }
        });

        doc.save(`AerialPM_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="space-y-6">
            <header className="border-b border-slate-800 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-100 uppercase flex items-center">
                        <FileText className="mr-3 text-amber-500" /> Executive Reports
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-1">Generate automated CV progress telemetries for stakeholders</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-500 px-4 py-2 font-mono text-sm flex items-center transition-colors">
                        <Printer className="w-4 h-4 mr-2" /> Print
                    </button>
                    <button onClick={handleExport} disabled={loading} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 font-mono text-sm font-bold flex items-center transition-colors disabled:opacity-50">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </button>
                </div>
            </header>

            {!loading && captures.length > 0 ? (
                <div className="glass-panel p-6 border-slate-800">
                    <h3 className="text-lg font-mono text-slate-300 mb-4 border-b border-slate-800 pb-2">PREVIEW: Telemetry Ledger</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="bg-slate-900 text-amber-500 uppercase">
                                <tr>
                                    <th className="p-3 border-b border-slate-800">Date</th>
                                    <th className="p-3 border-b border-slate-800">Project</th>
                                    <th className="p-3 border-b border-slate-800">Phase</th>
                                    <th className="p-3 border-b border-slate-800">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {captures.slice(0, 50).map(capture => (
                                    <tr key={capture.id} className="hover:bg-slate-900/30">
                                        <td className="p-3 text-slate-400">{new Date(capture.captured_at).toLocaleDateString()}</td>
                                        <td className="p-3 text-slate-300">{capture.project_name || `ID: ${capture.project_id}`}</td>
                                        <td className="p-3 text-slate-500 uppercase">{capture.phase || 'N/A'}</td>
                                        <td className="p-3 text-emerald-500 font-bold">{capture.cv_data?.score || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-20 text-center border-slate-800 border-dashed">
                    <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-display text-slate-300 tracking-wide uppercase mb-2">
                        {loading ? 'Compiling Telemetry...' : 'Reporting Engine Offline'}
                    </h3>
                    <p className="text-slate-500 font-mono text-sm max-w-md mx-auto">
                        Accumulate CV captures across active sites to unlock advanced predictive reporting and automated PDF document generation.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Reports;
