// src/services/obrasService.js
import obras from '@/data/obras.json'

export default {
  getAllObras() {
    return obras
  },

  getObraById(id) {
    return obras.find((obra) => obra.id === id)
  },

  filterObrasByTags(tags) {
    return obras.filter((obra) => {
      return Object.entries(tags).every(([key, value]) => obra.tags[key] === value)
    })
  },
}
