import re

with open('src/app/(frontend)/poster/PosterClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the entire POSTERS array
# It starts with "const POSTERS = [" and ends with "]"
content = re.sub(r'const POSTERS = \[\s*{.*?\n\]\n', '', content, flags=re.DOTALL)

# 2. Add posters to PosterClientProps
content = content.replace(
'''interface PosterClientProps {
  abstracts: AbstractDoc[]
}''',
'''interface PosterClientProps {
  abstracts: AbstractDoc[]
  posters: any[]
}'''
)

# 3. Change function signature
content = content.replace(
'''export function PosterClient({ abstracts }: PosterClientProps) {''',
'''export function PosterClient({ abstracts, posters }: PosterClientProps) {'''
)

# 4. Change POSTERS.filter to posters.filter
content = content.replace(
'''const filteredPosters = POSTERS.filter((poster) => {''',
'''const filteredPosters = posters.filter((poster) => {'''
)

# 5. Move topics inside
content = content.replace(
'''const topics = ['All', ...Array.from(new Set(POSTERS.map((p) => p.topic)))]''',
'''// Topics moved inside'''
)

content = content.replace(
'''  const { t } = useLanguage()''',
'''  const { t } = useLanguage()
  const topics = ['All', ...Array.from(new Set(posters.map((p) => p.topic)))]'''
)

# 6. Change poster.id to poster.posterId
content = content.replace(
'''poster.id.toLowerCase().includes(searchTerm.toLowerCase())''',
'''poster.posterId.toLowerCase().includes(searchTerm.toLowerCase())'''
)

content = content.replace(
'''<span className="text-[#4d4c9d] mr-2">{poster.id}</span>''',
'''<span className="text-[#4d4c9d] mr-2">{poster.posterId}</span>'''
)

# 7. Change poster.abstractId to poster.abstract
content = content.replace(
'''const abs = abstracts.find((a) => a.id === poster.abstractId)''',
'''const abs = abstracts.find((a) => a.id === (typeof poster.abstract === 'object' ? poster.abstract?.id : poster.abstract))'''
)


with open('src/app/(frontend)/poster/PosterClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Rewrote PosterClient")
