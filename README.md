# Suffy Store

A small, colorful storefront for eight Suffy characters. Plain HTML, CSS, JavaScript and local SVG illustrations. No build step, dependencies, account system or API keys.

## The collection

| Minecraft Suffys — $10 each | Original Suffys — $11 each |
| --- | --- |
| Zobo | Flowery |
| Bob Happy Gast | Caty |
| Foxey | Pine Appley |
| Dolfoney | Flootey |

Prices are USD. Shipping and tax are not configured.

## Open the website

Double-click `index.html`, or serve this folder with any static web server. For example, if Python is installed:

```sh
python -m http.server 8080
```

Then open http://localhost:8080 in a browser. The copy button needs a secure context such as HTTPS or localhost; downloading an order list also works when opening the file directly.

## Host on GitHub Pages

1. Put the contents of this folder in the root of your GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the **main** branch and **/ (root)**, then **Save**.
5. GitHub will display the public website address when deployment finishes.

All asset paths are relative, so the store works on a repository Pages URL or a custom domain. You can also upload the same folder to any static web host.

## Edit the store

- `app.js`: names, prices, collection labels, personalities and descriptions in the `products` array.
- `index.html`: hero text, story, FAQs and footer. Update these too if prices or characters change.
- `styles.css`: colors, layout and responsive styles.
- `assets/`: individual character illustrations and the favicon. Replace these with real product photos when available and update the image paths and illustration labels.

## What works

- Collection filters, text search and a random character button.
- Individual character dialogs.
- Favorites, bag quantities, removal and totals.
- Browser-local saving of favorites and the bag, with graceful handling when storage is unavailable.
- Downloadable and copyable order lists.
- Responsive layouts, keyboard controls and reduced-motion support.

## Ordering

This is a catalog with a bag and order-list export. It **does not accept payments or submit orders**. No seller email, payment processor, delivery policy, inventory or checkout service has been provided. Connect a real checkout service and confirm product information before taking online orders. Never put secret payment keys in this static website.

The SVG images are concept character illustrations, not photographs or product specifications. Descriptions introduce the characters and do not claim materials, dimensions or stock availability. Minecraft characters are fan-inspired; the website does not imply Mojang or Microsoft affiliation.
