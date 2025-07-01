import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName],
      // Reset other date filters when one is selected
      ...(filterName !== 'customRange' && {
        today: filterName === 'today' ? !prev.today : false,
        currentWeek: filterName === 'currentWeek' ? !prev.currentWeek : false,
        lastWeek: filterName === 'lastWeek' ? !prev.lastWeek : false,
        currentMonth: filterName === 'currentMonth' ? !prev.currentMonth : false,
        lastMonth: filterName === 'lastMonth' ? !prev.lastMonth : false,
      })
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Filter Events</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Date Range</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'today', label: 'Today' },
                      { id: 'currentWeek', label: 'Current Week' },
                      { id: 'lastWeek', label: 'Last Week' },
                      { id: 'currentMonth', label: 'Current Month' },
                      { id: 'lastMonth', label: 'Last Month' }
                    ].map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={option.id}
                          checked={filters[option.id]}
                          onChange={() => handleFilterChange(option.id)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label htmlFor={option.id} className="ml-2 text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Custom Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm text-gray-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        value={filters.customRange.start || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          customRange: {
                            ...prev.customRange,
                            start: e.target.value
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        value={filters.customRange.end || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          customRange: {
                            ...prev.customRange,
                            end: e.target.value
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setFilters({
                    today: false,
                    currentWeek: false,
                    lastWeek: false,
                    currentMonth: false,
                    lastMonth: false,
                    customRange: { start: null, end: null }
                  })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Reset Filters
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;