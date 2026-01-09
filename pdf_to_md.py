#!/usr/bin/env python3
import pdfplumber
import os

def pdf_to_markdown(pdf_path, md_path):
    """将PDF文件转换为Markdown格式"""
    with pdfplumber.open(pdf_path) as pdf:
        md_content = ""
        
        for page_num, page in enumerate(pdf.pages, 1):
            # 提取页面文本
            text = page.extract_text()
            
            if text:
                # 添加页码信息
                md_content += f"\n\n---\n**第 {page_num} 页**\n---\n\n"
                md_content += text
        
        # 保存为Markdown文件
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
    
    print(f"转换完成！Markdown文件已保存至：{md_path}")

if __name__ == "__main__":
    pdf_file = "/Users/ann/Documents/app/wenquchat/日报接口V1.0.pdf"
    md_file = "/Users/ann/Documents/app/wenquchat/日报接口V1.0.md"
    
    if os.path.exists(pdf_file):
        pdf_to_markdown(pdf_file, md_file)
    else:
        print(f"PDF文件不存在：{pdf_file}")
