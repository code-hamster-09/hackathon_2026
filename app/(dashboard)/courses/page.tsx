"use client"

import { useState } from "react"
import { TopNavbar } from "@/components/top-navbar"
import { CourseCard } from "@/components/courses/course-card"
import { courses } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categories = ["All", "AI & Data Science", "Web Development", "Design", "Cloud Computing", "Data Science", "Business"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filtered = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory
    const matchesDifficulty =
      selectedDifficulty === "All" || course.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <TopNavbar title="Courses" />
      <div className="flex flex-col gap-6 p-6">
        {/* Search and filters bar */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 bg-card pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedCategory === cat
                          ? ""
                          : "hover:bg-secondary"
                      )}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <Badge
                      key={diff}
                      variant={selectedDifficulty === diff ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedDifficulty === diff
                          ? ""
                          : "hover:bg-secondary"
                      )}
                      onClick={() => setSelectedDifficulty(diff)}
                    >
                      {diff}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> courses
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-foreground">No courses found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
