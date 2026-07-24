import re

files_to_update = {
    'src/app/(frontend)/agenda/page.tsx': {
        'import': "import SectionTitle from '@/components/ui/SectionTitle'\n",
        'target': r'<div className="text-center mb-16">\s*<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-4">議程大綱</h1>\s*<p className="text-stone-500 tracking-wider">Agenda Outline</p>\s*</div>',
        'replacement': '<SectionTitle title="議程大綱" subtitle="Agenda Outline" />',
        'after_import': "import Link from 'next/link'"
    },
    'src/app/(frontend)/keynote/page.tsx': {
        'import': "import SectionTitle from '@/components/ui/SectionTitle'\n",
        'target': r'<div className="text-center mb-16">\s*<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-4">專題演講</h1>\s*<p className="text-stone-500 tracking-wider">Keynote Speech</p>\s*</div>',
        'replacement': '<SectionTitle title="專題演講" subtitle="Keynote Speech" />',
        'after_import': "import Image from 'next/image'"
    },
    'src/app/(frontend)/poster/PosterClient.tsx': {
        'import': "import SectionTitle from '@/components/ui/SectionTitle'\n",
        'target': r'<div className="text-center mb-10">\s*<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-3">海報發表</h1>\s*<p className="text-stone-500 tracking-wider mt-2">Poster Sessions</p>\s*</div>',
        'replacement': '<SectionTitle title="海報發表" subtitle="Poster Sessions" />',
        'after_import': "import React, { useState, useMemo } from 'react'"
    },
    'src/app/(frontend)/schedule/ScheduleClient.tsx': {
        'import': "import SectionTitle from '@/components/ui/SectionTitle'\n",
        'target': r'<div className="text-center mb-12">\s*<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-4">大會細部議程</h1>\s*<p className="text-stone-500 tracking-wider mb-8">Detailed Schedule</p>\s*</div>',
        'replacement': '<div className="mb-4">\n          <SectionTitle title="大會細部議程" subtitle="Detailed Schedule" />\n        </div>',
        'after_import': "import React, { useState, useMemo } from 'react'"
    },
    'src/app/(frontend)/sessions/SessionsClient.tsx': {
        'import': "import SectionTitle from '@/components/ui/SectionTitle'\n",
        'target': r'<div className="text-center mb-10">\s*<h1 className="text-4xl font-bold tracking-widest text-\[#4d4c9d\] mb-3">分組論文發表</h1>\s*<p className="text-stone-500 tracking-wider">Parallel Sessions & Abstracts</p>\s*</div>',
        'replacement': '<SectionTitle title="分組論文發表" subtitle="Parallel Sessions & Abstracts" />',
        'after_import': "import React, { useState, useMemo } from 'react'"
    }
}

for filepath, info in files_to_update.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already imported
    if "import SectionTitle" not in content:
        content = content.replace(info['after_import'], info['import'] + info['after_import'])
        
    content = re.sub(info['target'], info['replacement'], content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated Agenda pages to use SectionTitle")
