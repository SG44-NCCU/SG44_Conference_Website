import re
import os

files_to_update = {
    'src/app/(frontend)/layout.tsx': [
        (r"title: 'SG44 \| 第44屆測量及空間資訊研討會'", r"title: '第44屆測量及空間資訊研討會 SG44 Conference on Surveying and Geomatics'")
    ],
    'src/app/(frontend)/agenda/page.tsx': [
        (r"title: '議程大綱 \| SG44'", r"title: '議程大綱 Agenda | SG44'")
    ],
    'src/app/(frontend)/keynote/page.tsx': [
        (r"title: '專題演講 \| SG44'", r"title: '專題演講 Keynote | SG44'")
    ],
    'src/app/(frontend)/poster/page.tsx': [
        (r"title: '海報發表 \| SG44'", r"title: '海報發表 Poster | SG44'")
    ],
    'src/app/(frontend)/poster/PosterClient.tsx': [
        (r'(<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-3">海報發表</h1>)', 
         r'\1\n        <p className="text-stone-500 tracking-wider mt-2">Poster Sessions</p>')
    ],
    'src/app/(frontend)/schedule/page.tsx': [
        (r"title: '細部議程 \| SG44'", r"title: '大會細部議程 Detailed Schedule | SG44'")
    ],
    'src/app/(frontend)/schedule/ScheduleClient.tsx': [
        (r'(<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-4">大會細部議程</h1>)',
         r'\1\n          <p className="text-stone-500 tracking-wider mb-8">Detailed Schedule</p>')
    ],
    'src/app/(frontend)/schedule-admin/page.tsx': [
        (r"title: '細部議程後台管理 \| SG44'", r"title: '細部議程後台管理 Schedule Admin | SG44'")
    ],
    'src/app/(frontend)/sessions/page.tsx': [
        (r"title: '分組論文發表 \| SG44'", r"title: '分組論文發表 Parallel Sessions | SG44'")
    ],
    'src/app/(frontend)/3S_competition_flow/page.tsx': [
        (r"title: '3S創客競賽流程 \| SG44'", r"title: '3S創客競賽流程 3S Maker Competition Flow | SG44'"),
        (r'(<h1 className="text-3xl sm:text-4xl font-semibold tracking-wide text-stone-900 mb-4">\s*2026 年大專生 3S 創客競賽流程\s*</h1>)',
         r'\1\n          <p className="text-stone-500 tracking-wider text-lg">2026 3S Maker Competition Flow</p>')
    ],
    'src/app/(frontend)/dashboard/my-competitions/page.tsx': [
        (r'(<h1 className="text-2xl font-semibold tracking-wide text-stone-800">)我的競賽(</h1>)',
         r'\1我的競賽 My Competitions\2')
    ],
}

for filepath, replacements in files_to_update.items():
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated titles!")
