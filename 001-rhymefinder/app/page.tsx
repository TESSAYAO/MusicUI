"use client"

import { useState, useEffect, useRef } from "react"
import { Filter } from "lucide-react"

// Define types for our data
type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb"
type FilterOption = "all" | PartOfSpeech

interface WordBlock {
  word: string
  song: string
  artist: string
  lyric: string
  partOfSpeech: PartOfSpeech
}

export default function SearchInterface() {
  const [searchText, setSearchText] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(0)
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null)
  const [showingLyrics, setShowingLyrics] = useState<{ [key: number]: boolean }>({})
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredBlocks, setFilteredBlocks] = useState<WordBlock[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  // Sample data with part of speech information
  const blocks: WordBlock[] = [
    {
      word: "friend",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "You just call on me brother, when you need a friend",
      partOfSpeech: "noun",
    },
    {
      word: "end",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "I'll help you carry on, for it won't be long 'til I'm gonna need somebody to lean on",
      partOfSpeech: "noun",
    },
    {
      word: "send",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric:
        "Please swallow your pride if I have things you need to borrow, for no one can fill those of your needs that you won't let show",
      partOfSpeech: "verb",
    },
    {
      word: "lean",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "Lean on me when you're not strong, and I'll be your friend",
      partOfSpeech: "verb",
    },
    {
      word: "strong",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "Lean on me when you're not strong, and I'll be your friend",
      partOfSpeech: "adjective",
    },
    {
      word: "proud",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "If there is a load you have to bear that you can't carry, I'm right up the road, I'll share your load",
      partOfSpeech: "adjective",
    },
    {
      word: "carry",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "So just call on me brother, when you need a hand, we all need somebody to lean on",
      partOfSpeech: "verb",
    },
    {
      word: "swallow",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric:
        "Please swallow your pride if I have things you need to borrow, for no one can fill those of your needs that you won't let show",
      partOfSpeech: "verb",
    },
    {
      word: "need",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "Lean on me when you're not strong, and I'll be your friend, I'll help you carry on",
      partOfSpeech: "verb",
    },
    // Add more blocks to demonstrate scrolling
    {
      word: "help",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "I'll help you carry on, for it won't be long 'til I'm gonna need somebody to lean on",
      partOfSpeech: "verb",
    },
    {
      word: "call",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "You just call on me brother, when you need a friend",
      partOfSpeech: "verb",
    },
    {
      word: "brother",
      song: "Lean on Me",
      artist: "Bill Withers",
      lyric: "You just call on me brother, when you need a friend",
      partOfSpeech: "noun",
    },
  ]

  // Filter options
  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "noun", label: "Noun" },
    { value: "verb", label: "Verb" },
    { value: "adjective", label: "Adjective" },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter blocks based on search text and selected filter
  useEffect(() => {
    let results = [...blocks]

    // Filter by part of speech if selected
    if (selectedFilter && selectedFilter !== "all") {
      results = results.filter((block) => block.partOfSpeech === selectedFilter)
    }

    // Filter by search text if provided
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      const searchResults = results.filter((block) => block.word.toLowerCase().includes(searchLower))

      // If no filter is selected or "All" is selected and no results match search, show all results
      if ((!selectedFilter || selectedFilter === "all") && searchResults.length === 0) {
        setFilteredBlocks(blocks)
      } else {
        setFilteredBlocks(searchResults)
      }
    } else {
      // If no search text, just apply part of speech filter
      setFilteredBlocks(results)
    }
  }, [searchText, selectedFilter])

  // Function to handle block click
  const handleBlockClick = (index: number) => {
    setSelectedBlock(index)

    // Toggle lyrics display for this block
    setShowingLyrics((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Function to get block background color based on state
  const getBlockBgColor = (index: number) => {
    if (index === selectedBlock) return "bg-[#0099cc]" // Dark blue for selected
    if (index === hoveredBlock) return "bg-[#00b8e6]" // Medium blue for hover
    return "bg-[#6acaea] bg-opacity-80" // Light transparent blue for default
  }

  // Function to highlight the word in lyrics
  const highlightWord = (lyric: string, word: string) => {
    // Case insensitive search for the word
    const regex = new RegExp(`(${word})`, "gi")
    const parts = lyric.split(regex)

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-[#00bfff] font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    )
  }

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e6f7fc]">
      <div className="w-full max-w-4xl p-8 rounded-3xl bg-[#e6f7fc]">
        <div className="flex items-center mb-8 space-x-[30px]">
          {/* Search Bar */}
          <div className="flex-1 flex items-center rounded-full bg-white p-2 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-6 py-3 text-xl font-mono bg-transparent border-none outline-none"
              />
              {!searchText && isFocused && (
                <span className="absolute top-1/2 left-6 transform -translate-y-1/2 h-6 w-0.5 bg-black animate-blink"></span>
              )}
            </div>

            {/* Search Button */}
            <button className="px-8 py-3 text-xl font-medium text-white rounded-full bg-[#00bfff] hover:bg-[#0099cc] transition-colors">
              Search
            </button>
          </div>

          {/* Filter Button - Styled like search bar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-6 py-3 text-xl font-medium text-gray-700 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center"
            >
              <Filter className="mr-2 h-5 w-5 text-gray-500" />
              <span>
                {selectedFilter ? filterOptions.find((opt) => opt.value === selectedFilter)?.label : "Filter"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 right-0 mt-2 bg-white rounded-2xl shadow-lg overflow-hidden w-48">
                {filterOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                      selectedFilter === option.value ? "bg-[#e6f7fc]" : ""
                    }`}
                    onClick={() => {
                      setSelectedFilter(option.value)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Grid with Custom Scrollbar */}
        <div className="relative">
          <div
            ref={resultsContainerRef}
            className="grid grid-cols-3 gap-4 overflow-y-auto pr-4 custom-scrollbar-container"
            style={{ maxHeight: "500px" }}
          >
            {filteredBlocks.map((block, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl text-white cursor-pointer transition-colors duration-200 ${getBlockBgColor(
                  index,
                )}`}
                onClick={() => handleBlockClick(index)}
                onMouseEnter={() => setHoveredBlock(index)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                {showingLyrics[index] ? (
                  // Show lyrics with highlighted word
                  <div className="text-xl">{highlightWord(block.lyric, block.word)}</div>
                ) : (
                  // Show original word, part of speech, and song info
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-mono">{block.word}</h3>
                      <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {block.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xl">
                      {block.song}
                      <br />- {block.artist}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Custom Scrollbar */}
          <div className="custom-scrollbar-track">
            <div className="custom-scrollbar-thumb"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
