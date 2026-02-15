# Demo Script: Task 1 - Story Capture

## Steps to Test Story Capture Functionality

### 1. Navigate to the Product Creation Flow
- Go to: http://localhost:3001/artisan/new-product
- You should see the "Product Photo" step with camera interface

### 2. Complete Photo Step
- Wait for camera to initialize (1 second delay)
- Take a photo or upload a file
- Click "Next" to proceed to "Product Details"

### 3. Complete Details Step
- Fill in:
  - Title: "Hand-Carved Oak Bowl"
  - Category: Select "Pottery" or any category
  - Dimensions: "8\" x 6\" x 3\""
- Click "Next" to proceed to "Craft Story" step

### 4. Test Story Capture (NEW!)
- You should now see the story step with:
  - Voice recording interface with microphone button
  - Manual text input option
  - "Skip Story for Now" button

#### Option A: Voice Recording
1. Click the microphone button
2. Speak your story (e.g., "I created this beautiful hand-carved wooden bowl over three weeks...")
3. Click the stop button
4. Click "Process Story" to generate AI-enhanced version
5. Review and edit the generated story

#### Option B: Manual Input
1. Type your story in the text area
2. Click "Generate Story with AI" for enhancement

#### Option C: Skip Story
1. Click "Skip Story for Now" to proceed to pricing

### 5. Expected Results

#### If using voice recording:
- Should see "✓ Story Captured!" success message
- AI-generated story appears in text area
- Original transcript shown below
- Both story and short description fields populated

#### If using manual input:
- Story appears in text area
- Can generate AI enhancement

#### If skipping:
- Proceeds directly to pricing step

### 6. API Response Sample
When story is processed, you should see a response like:
```json
{
  "success": true,
  "transcript": "I created this beautiful hand-carved wooden bowl...",
  "craft_story_id": "ai_asset_1703123456789",
  "craft_story": "I created this beautiful hand-carved wooden bowl over the course of three weeks, using reclaimed oak wood...",
  "short_description": "A beautifully crafted handmade piece that combines traditional techniques with modern appeal."
}
```

### 7. Navigation Test
- Next button should now work on story step
- Should be able to proceed to pricing step
- Previous button should work to go back

## Troubleshooting

### If Next button is still disabled:
- Make sure you've either recorded a story, typed text, or clicked "Skip Story"
- Check browser console for any errors

### If voice recording doesn't work:
- Check microphone permissions in browser
- Try refreshing the page
- Use manual text input as fallback

### If API errors occur:
- Check that the server is running on localhost:3001
- Check browser network tab for failed requests
- The system should gracefully fallback to manual input

## Success Criteria ✅
- [ ] Voice recording interface appears
- [ ] Can record and process voice story
- [ ] AI generates enhanced story text
- [ ] Story can be edited inline
- [ ] Next button works to proceed
- [ ] Skip functionality works
- [ ] Form validation passes
