"use client";
import authProtection from "@/auth/authProtection";
import QABoxesList from "@/components/qabox/qaboxeslist";

function QABoxesPage() {
	return <QABoxesList />;
}

export default authProtection(QABoxesPage);
