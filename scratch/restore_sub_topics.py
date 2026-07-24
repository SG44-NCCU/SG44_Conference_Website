import re

topics_zh = {
    'sub.topics.1.zh': '大地測量與導航技術',
    'sub.topics.2.zh': '車載測繪與室內定位',
    'sub.topics.3.zh': '無人載具與災害調查',
    'sub.topics.4.zh': '攝影測量與測繪管理',
    'sub.topics.5.zh': '智慧科技與跨域應用',
    'sub.topics.6.zh': '數位城市與資訊服務',
    'sub.topics.7.zh': '環境永續與韌性防災',
    'sub.topics.8.zh': '衛星科技與海洋測繪',
    'sub.topics.9.zh': '國土政策與規劃治理',
}

topics_en = {
    'sub.topics.1.en': 'Geodetic Science and Navigation Techniques',
    'sub.topics.2.en': 'Mobile Mapping System and Indoor Positioning Techniques',
    'sub.topics.3.en': 'Unmanned Vehicle Systems and Disaster Investigation',
    'sub.topics.4.en': 'Photogrammetry and Surveying Management',
    'sub.topics.5.en': 'Intelligent Techniques and Cross-Disciplinary Applications',
    'sub.topics.6.en': 'Smart City and Geoinformation Services',
    'sub.topics.7.en': 'Environmental Sustainability and Disaster Resilience',
    'sub.topics.8.en': 'Satellite Technology and Marine Surveying',
    'sub.topics.9.en': 'Land Policy and Planning Governance',
}

with open('src/contexts/LanguageContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

zh_insert = "\n".join([f"    '{k}': '{v}'," for k, v in topics_zh.items()]) + "\n" + "\n".join([f"    '{k}': '{v}'," for k, v in topics_en.items()])
en_insert = zh_insert # Same for both since we query specific language keys directly `sub.topics.x.zh`

content = content.replace("zh: {", f"zh: {{\n{zh_insert}")
content = content.replace("en: {", f"en: {{\n{en_insert}")

with open('src/contexts/LanguageContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored exact topics!")
