declare global {

  interface ProjectInterface {
    
    id: string;
    lang: "en"|"ar";
    title: string;
    name: string;
    chatbox: string;
    article_text?: string;
    article?: string;
    description: string;
    outline: string[];
    used_credits: 0;
    user_name: string;
    created_at: string;
    modified_at: string;
}

  export interface PaperSearchDataInerface {
    identifier?: string;
    title: string;
    source?: "springer" | "arxiv" | "archive"; 
    summary: string;
    url?: string;
    pdfUrl?: string;
    publisher?: string;
    published?: string;
  }
}

export default global;
