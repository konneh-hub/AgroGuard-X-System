# AgroGuard X - Stage TODO

## Auth (already implemented)
- [x] AuthProvider + session refresh (SecureStore/localStorage)
- [x] Auth screens + routing
- [x] Splash redirect after auth

## Stage 2: Farm Registration Module

### Route & Navigation
- [ ] Create protected farms routes under `src/app/(protected)/farms/*`
  - [ ] `/farms/dashboard`
  - [ ] `/farms/my-farms`
  - [ ] `/farms/add-farm`
  - [ ] `/farms/edit-farm/:id`
  - [ ] `/farms/details/:id`
  - [ ] `/farms/map`
  - [ ] `/farms/history/:id`
- [ ] Update `src/app/(protected)/explore.tsx` to provide navigation links into farms

### Feature Scaffolding
- [ ] Create `src/features/farms/` module with:
  - [ ] `types/` (Farm, Draft, Boundary, Stats, History)
  - [ ] `api/` (Supabase client + repository)
  - [ ] `components/` (form, map editor, image picker, stats cards, draft banner)
  - [ ] `utils/` (boundary serialization + area + draft schema)

### Farm Data Model
- [ ] Implement types for required fields:
  - [ ] Farm Name, Farm Owner, Farm Size
  - [ ] Crop Type, Soil Type
  - [ ] Planting Date, GPS Coordinates
  - [ ] Farm Images
  - [ ] Farm Boundary polygon

### Offline Draft Saving
- [ ] Implement draft persistence using `src/lib/storage.ts`
- [ ] Autosave draft while editing (debounced)
- [ ] Resume draft capability on Add/Edit screens

### GPS Tracking
- [ ] Add flow to capture GPS coordinates
- [ ] Ensure graceful handling of permissions

### Image Upload
- [ ] Implement offline-friendly image selection
- [ ] Implement upload to Supabase Storage on “Save Farm”

### Farm Boundary Mapping (Polygon)
- [ ] Integrate React Native Maps boundary editor (tap-to-add vertices)
- [ ] Render saved polygon
- [ ] Compute derived area + stats fallback

### Farm Statistics & History
- [ ] Implement farm statistics derivation (local)
- [ ] History UI + backend wiring (repository calls; assumes tables exist)

### Production Readiness
- [ ] TypeScript compile
- [ ] `npm run lint`
- [ ] Smoke test flows: add farm offline draft, boundary mapping, image upload wiring

