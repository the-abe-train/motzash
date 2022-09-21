![Motzash Banner](https://motzash.app/motzash-preview.png)

# Motzash
Motzash is your dashboard companion for Jewish holidays. Use Motzash to get time for candle lighting and havdalah for Shabbat and Chag, and plan your Holy days with friends!

Motzash is an open-source project built with [Solid](https://www.solidjs.com/). Contributions are welcome! To contribute, take a look at the steps below. Feel free to raise issues and discussions as well, or reach out to me directly by [Twitter](https://twitter.com/theAbeTrain/) or [my personal website](https://www.the-abe-train.com/).

## Technologies
| Purpose                     | Technology |
|-----------------------------|------------|
| Programming language        | Typescript |
| Front-end framework         | Solid      |
| Serverless functions        | Netlify    |
| Database and authentication | Supabase   |
| Bundler                     | Vite       |
| Testing framework           | Cypress    |
| CSS Framework               | Tailwind   |

## Contributions
Local development is not very accessible at the moment due to the serverless functions that are core to the app's functionality. Localhost developers will only be able to see your live changes for when not signed-in, and with no location data. If you would like to contribute to this repository, follow the steps below:
1. Clone this repo to your computer.
2. Install dependencies with `npm i`.
3. Create a file called `.env` and paste the following lines into it:
```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiYWJldHJhaW4iLCJhIjoiY2tyaXN4NGVkMDAwYzJvbzllM2luZmFodSJ9.gS4syZW65fWJ0jwoIk8t_g
VITE_SUPABASE_URL=https://wnfwbgxynjfiuiasogfj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZndiZ3h5bmpmaXVpYXNvZ2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAzMjY3ODksImV4cCI6MTk3NTkwMjc4OX0.qaIlMOfyqVdFmgW6mtS1KVlQt2Q9jHYVAah-VgkYzKU
```
4. Start the local server with `npm run dev`.


# License

Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg