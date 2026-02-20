'use client'
import SectionTitle from '@/components/ui/SectionTitle'
import { TIMELINE_DATA } from '@/lib/constants'
import React, { useEffect, useRef, useState, useCallback } from 'react'

const TimelineSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)

  // 狀態：捲動進度 (0 ~ 1)
  const [progress, setProgress] = useState(0)
  // 狀態：是否正在拖曳滑桿 (底部滑桿)
  const [isDragging, setIsDragging] = useState(false)
  // 狀態：是否正在直接拖曳時間軸內容
  const [isContentDragging, setIsContentDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollLeftStart = useRef(0)

  // ✨ 功能 1: 處理滑鼠滾輪 (將垂直滾動轉換為水平滾動)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // 如果是在容器內滾動，且沒有按住 Shift (Shift+滾輪原本就是水平捲動，不用干涉)
      if (e.deltaY !== 0 && !e.shiftKey) {
        // 防止頁面上下滾動
        e.preventDefault()
        // 將垂直滾動量 (deltaY) 加到水平滾動位置 (scrollLeft)
        container.scrollLeft += e.deltaY
      }
    }

    // 必須使用 passive: false 才能使用 preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // ✨ 功能 2: 監聽捲動事件，更新滑桿進度
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const maxScroll = scrollWidth - clientWidth
      // 計算百分比 (0 ~ 1)
      const newProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0
      setProgress(newProgress)
    }
  }

  // ✨ 功能 3: 拖曳滑桿邏輯
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollbarRef.current || !scrollContainerRef.current) return

      const track = scrollbarRef.current
      const container = scrollContainerRef.current

      const trackRect = track.getBoundingClientRect()
      const trackWidth = trackRect.width

      // 計算滑鼠在軌道上的相對位置 (0 ~ 1)
      // 這裡減去 trackRect.left 是為了取得滑鼠在軌道內的 X 座標
      let clickPositionRatio = (e.clientX - trackRect.left) / trackWidth

      // 限制範圍在 0 ~ 1 之間
      clickPositionRatio = Math.max(0, Math.min(1, clickPositionRatio))

      // 更新容器的 scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      container.scrollLeft = clickPositionRatio * maxScroll
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // ✨ 功能 4: 拖曳時間軸內容 (滑鼠)
  const handleContentMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current
    if (!container) return
    setIsContentDragging(true)
    dragStartX.current = e.clientX
    scrollLeftStart.current = container.scrollLeft
    e.preventDefault()
  }, [])

  const handleContentMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isContentDragging || !scrollContainerRef.current) return
      const dx = e.clientX - dragStartX.current
      scrollContainerRef.current.scrollLeft = scrollLeftStart.current - dx
    },
    [isContentDragging],
  )

  const handleContentMouseUpOrLeave = useCallback(() => {
    setIsContentDragging(false)
  }, [])

  // ✨ 功能 5: 拖曳時間軸內容 (觸控)
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current
    if (!container) return
    dragStartX.current = e.touches[0].clientX
    scrollLeftStart.current = container.scrollLeft
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current
    if (!container) return
    const dx = e.touches[0].clientX - dragStartX.current
    container.scrollLeft = scrollLeftStart.current - dx
  }, [])

  // 初始定位 (維持不變)
  useEffect(() => {
    const nearestEventIndex = TIMELINE_DATA.findIndex((event) => !event.isPast)
    if (scrollContainerRef.current && nearestEventIndex !== -1) {
      const container = scrollContainerRef.current
      const items = container.querySelectorAll('[data-timeline-item]')
      if (items[nearestEventIndex]) {
        const item = items[nearestEventIndex] as HTMLElement
        const containerWidth = container.offsetWidth
        const itemLeft = item.offsetLeft
        const itemWidth = item.offsetWidth
        const scrollPosition = itemLeft - containerWidth / 2 + itemWidth / 2

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        })
      }
    }
  }, [])

  // 標題格式化 (維持不變)
  const formatTitle = (title: string) => {
    return title.split('及').map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {index < array.length - 1 && (
          <>
            及<br />
          </>
        )}
      </React.Fragment>
    ))
  }

  return (
    <section id="timeline" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-32 bg-stone-50/40 -translate-y-1/2 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="重要時程" subtitle="Important Deadlines & Milestones" />

        <div className="relative mt-20">
          {/* 電腦版時間軸 (Desktop) */}
          <div className="hidden md:block">
            {/* 左右漸層遮罩 (讓邊緣看起來比較柔和) */}
            <div className="absolute left-0 top-0 bottom-12 w-20 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-12 w-20 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onMouseDown={handleContentMouseDown}
              onMouseMove={handleContentMouseMove}
              onMouseUp={handleContentMouseUpOrLeave}
              onMouseLeave={handleContentMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              className={`overflow-x-auto scrollbar-hide pb-12 select-none ${
                isContentDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: isContentDragging ? 'auto' : 'smooth',
              }}
            >
              <div className="relative inline-flex min-w-full px-20">
                <div className="absolute top-[72px] left-0 right-0 h-0.5 bg-stone-100"></div>

                <div className="relative z-10 flex gap-8">
                  {TIMELINE_DATA.map((event, index) => (
                    <div
                      key={index}
                      data-timeline-item
                      className="flex flex-col items-center flex-shrink-0 w-48 select-none" // select-none 防止拖曳時選取文字
                    >
                      <div
                        className={`mb-8 transition-all duration-300 ${
                          event.isPast ? 'opacity-40' : 'opacity-100'
                        }`}
                      >
                        <span className="text-sm font-mono font-bold tracking-widest text-stone-600 bg-white px-2 uppercase whitespace-nowrap">
                          {event.date}
                        </span>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full border-[6px] border-white shadow-sm flex items-center justify-center transition-all duration-500 ${
                          event.isPast
                            ? 'bg-stone-300'
                            : 'bg-[#5F7161] ring-2 ring-stone-100 scale-110'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>

                      <div
                        className={`mt-8 px-2 text-center transition-all duration-300 ${
                          event.isPast ? 'opacity-40' : 'opacity-100'
                        }`}
                      >
                        <h4 className="text-sm font-bold text-stone-800 leading-tight">
                          {formatTitle(event.title)}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ✨ 自定義滑桿區塊 */}
            <div className="max-w-md mx-auto mt-2 px-4">
              <div
                ref={scrollbarRef}
                className="relative w-full h-1.5 bg-stone-100 rounded-full cursor-pointer group"
                // 點擊軌道也能跳轉
                onClick={(e) => {
                  if (!scrollContainerRef.current) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const ratio = (e.clientX - rect.left) / rect.width
                  const maxScroll =
                    scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
                  scrollContainerRef.current.scrollTo({
                    left: ratio * maxScroll,
                    behavior: 'smooth',
                  })
                }}
              >
                {/* 滑塊 Thumb */}
                <div
                  className={`absolute top-0 bottom-0 bg-stone-300 rounded-full cursor-grab active:cursor-grabbing hover:bg-[#5F7161] transition-colors duration-200 ${isDragging ? 'bg-[#5F7161]' : ''}`}
                  style={{
                    left: `${progress * 100}%`,
                    width: '15%', // 滑塊寬度
                    transform: 'translateX(-50%)', // 讓定位點在滑塊中心
                    // 限制滑塊不要超出軌道
                    maxWidth: '100%',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* 裝飾：增加滑塊的觸控區域，比較好按 */}
                  <div className="absolute inset-0 -m-2"></div>
                </div>
              </div>
              <p className="text-center text-[10px] text-stone-400 mt-2 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                拖曳滑桿或使用滾輪
              </p>
            </div>
          </div>

          {/* 手機版時間軸 (Mobile) - 保持不變 */}
          <div className="md:hidden relative px-4">
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-stone-100 -translate-x-1/2 rounded-full"></div>

            <div className="space-y-16">
              {TIMELINE_DATA.map((event, index) => (
                <div key={index} className="relative flex items-center group">
                  <div className="relative z-10 flex-shrink-0 w-12 flex justify-center">
                    <div
                      className={`w-10 h-10 rounded-full border-[6px] border-white shadow-md flex items-center justify-center transition-all duration-500 ${
                        event.isPast ? 'bg-stone-300' : 'bg-[#5F7161] ring-2 ring-stone-50'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    </div>
                  </div>

                  <div
                    className={`ml-6 flex-1 transition-all duration-300 ${
                      event.isPast ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-mono tracking-[0.2em] mb-1 ${
                          event.isPast ? 'text-stone-600' : 'text-[#5F7161]'
                        }`}
                      >
                        {event.date}
                      </span>
                      <h4
                        className={`text-lg font-black tracking-tight ${
                          event.isPast ? 'text-stone-500 font-bold' : 'text-stone-800'
                        }`}
                      >
                        {formatTitle(event.title)}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default TimelineSection
