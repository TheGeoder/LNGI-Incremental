# Incremental Game — v1.0.0demo

## Files
- `index.html` — page structure and loads the number library.
- `style.css` — dark UI and glowing Arial Black clicker number.
- `app.js` — clicking, upgrades, generator, rebirth, speed controls, milestones, saving, and soundtrack player.
- `assets/UntitledTrack01.m4a` — first uploaded track.
- `assets/UntitledTrack02.mp3` — second uploaded track.

## Run on GitHub Pages
1. Upload the contents of this folder to the root of your GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your main branch and `/ (root)`, then save.
5. Open the Pages URL GitHub provides.

The number engine (`break_eternity.js`) is loaded from jsDelivr, so the game needs an internet connection for extremely large-number support. Progress saves in the browser's local storage.

## Notes
- The first track is the M4A audio upload renamed to `UntitledTrack01.m4a`.
- The second track is the MP3 upload renamed to `UntitledTrack02.mp3`.
- TREE(3), Rayo's number, ordinal infinity, and absolute infinity are represented as concept milestones rather than pretending they are ordinary finite JavaScript numbers.
