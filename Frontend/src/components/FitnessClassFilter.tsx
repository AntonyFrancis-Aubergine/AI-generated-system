import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FitnessClassFilters } from "../types/fitnessClass";
import { fitnessClassService } from "../services/fitnessClass.service";
import { motion } from "framer-motion";
import "../styles/fitnessClassFilter.css";

interface FitnessClassFilterProps {
  onFilterChange: (filters: FitnessClassFilters) => void;
}

export function FitnessClassFilter({
  onFilterChange,
}: FitnessClassFilterProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fitnessClassService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: FitnessClassFilters = {};

    if (name) filters.name = name;
    if (categoryId) filters.categoryId = categoryId;
    if (startDateFrom)
      filters.startDateFrom = new Date(startDateFrom).toISOString();
    if (startDateTo) filters.startDateTo = new Date(startDateTo).toISOString();

    onFilterChange(filters);
  };

  const handleReset = () => {
    setName("");
    setCategoryId("");
    setStartDateFrom("");
    setStartDateTo("");
    onFilterChange({});
  };

  return (
    <div className="filter-container">
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-row">
          {/* Search by name */}
          <div className="search-container">
            <div className="search-icon">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search classes..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category filter */}
          <div className="category-container">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            aria-label="Toggle advanced filters"
            className="filter-button"
          >
            <Filter className="filter-icon" />
          </Button>

          <Button type="submit">Apply Filters</Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Advanced filters (expandable) */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="advanced-filters"
          >
            <div className="dates-grid">
              <div className="date-field">
                <label className="date-label">Classes From</label>
                <div className="date-input-container">
                  <div className="date-icon">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Input
                    type="date"
                    value={startDateFrom}
                    onChange={(e) => setStartDateFrom(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>

              <div className="date-field">
                <label className="date-label">Classes To</label>
                <div className="date-input-container">
                  <div className="date-icon">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Input
                    type="date"
                    value={startDateTo}
                    onChange={(e) => setStartDateTo(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
