import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/statement.css";
import { useTranslation } from "react-i18next";

const Statement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState("last_30");
    const [format, setFormat] = useState("pdf");
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        // Simulate download
        setTimeout(() => {
            setIsDownloading(false);
            // Could add a toast notification here
        }, 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="statement-container"
        >
            <div className="page-header-row mb-4">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="page-title mb-0">{t("eStatement")}</h2>
            </div>

            <div className="statement-card glass-card">
                <div className="card-logo-area text-center mb-4">
                    <div className="statement-icon mx-auto">
                        <FileText size={40} className="text-accent" />
                    </div>
                </div>

                <div className="form-group mb-4">
                    <label className="d-flex align-items-center gap-2 mb-2 text-muted">
                        <Calendar size={18} /> {t("selectPeriod")}
                    </label>
                    <div className="options-grid">
                        <button 
                            className={`option-btn ${dateRange === 'last_30' ? 'active' : ''}`}
                            onClick={() => setDateRange('last_30')}
                        >
                            {t("last30Days")}
                        </button>
                        <button 
                            className={`option-btn ${dateRange === 'this_year' ? 'active' : ''}`}
                            onClick={() => setDateRange('this_year')}
                        >
                            {t("thisYear")}
                        </button>
                        <button 
                            className={`option-btn ${dateRange === 'financial_year' ? 'active' : ''}`}
                            onClick={() => setDateRange('financial_year')}
                        >
                            {t("fy202324")}
                        </button>
                        <button 
                            className={`option-btn ${dateRange === 'custom' ? 'active' : ''}`}
                            onClick={() => setDateRange('custom')}
                        >
                            {t("customRange")}
                        </button>
                    </div>
                </div>

                {dateRange === 'custom' && (
                    <div className="custom-dates row mb-4">
                         <div className="col form-group">
                             <label>{t("fromDate")}</label>
                             <input type="date" className="styled-input" />
                         </div>
                         <div className="col form-group">
                             <label>{t("toDate")}</label>
                             <input type="date" className="styled-input" />
                         </div>
                    </div>
                )}

                <div className="form-group mb-4">
                    <label className="d-flex align-items-center gap-2 mb-2 text-muted">
                        <Filter size={18} /> {t("formatLabel")}
                    </label>
                    <div className="format-toggle">
                        <button 
                            className={`format-btn ${format === 'pdf' ? 'active' : ''}`}
                            onClick={() => setFormat('pdf')}
                        >
                            <span className="format-icon pdf">PDF</span>
                            {t("adobePdf")}
                        </button>
                        <button 
                            className={`format-btn ${format === 'csv' ? 'active' : ''}`}
                            onClick={() => setFormat('csv')}
                        >
                             <span className="format-icon excel">CSV</span>
                            {t("excelCsv")}
                        </button>
                    </div>
                </div>

                <div className="statement-summary mb-4">
                    <p className="text-muted text-center" style={{fontSize: '0.85rem'}}>
                        {t("statementPasswordStmt1")} <br/>
                        {t("statementPasswordStmt2")} <b>DDMMYYYY</b> format.
                    </p>
                </div>

                <button 
                    onClick={handleDownload} 
                    className="btn-primary full-width"
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <span>{t("processingStr")}</span>
                    ) : (
                        <><Download size={20} style={{marginRight: '8px'}} /> {t("downloadStatement")}</>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default Statement;
