import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

export const scrapeSydneyEvents = async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.sydney.com/events', { waitUntil: 'networkidle2' });

    await page.waitForSelector('div.product-list__results.grid__product-list.product-list__results-list ol > li');

    const events = await page.$$eval(
      'div.product-list__results.grid__product-list.product-list__results-list ol > li',
      (items) =>
        items.map((el, index) => {
          const getText = (selector: string) => el.querySelector(selector)?.textContent?.trim() || '';
          const getAttr = (selector: string, attr: string) =>
            el.querySelector(selector)?.getAttribute(attr) || '';

          const title = getText('.tile__product-list-tile-heading h3');
          const ticketUrl = getAttr('a[href^="https://www.sydney.com/destinations"]', 'href');
          const image = getAttr('picture img', 'src');
          const date = getText('.product__list-date.type__ribbon');
          const description = getText('.prod-desc');
          const venue = getText('span.tile__area-name');

          return {
            id: index + 1,
            title,
            venue,
            image,
            date,
            description,
            ticketUrl,
          };
        })
    );

    await browser.close();

    res.json({ events });
  } catch (error) {
    console.error('Puppeteer scrape error:', error);
    res.status(500).json({ error: 'Failed to scrape events using Puppeteer' });
  }
};

// export const scrapeSydneyEvents = async (req: Request, res: Response) => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto('https://www.sydney.com/events?10741-classification[]=FESTIVAL', { waitUntil: 'networkidle2' });

//     // Wait for the list to render
//     await page.waitForSelector('div.product-list__results.grid__product-list.product-list__results-list ol > li');

//     // Extract event data
//     const events = await page.$$eval(
//       'div.product-list__results.grid__product-list.product-list__results-list ol > li',
//       (items) =>
//         items.map((el) => {
//           const getText = (selector: string) => el.querySelector(selector)?.textContent?.trim() || '';
//           const getAttr = (selector: string, attr: string) =>
//             el.querySelector(selector)?.getAttribute(attr) || '';

//           const title = getText('.tile__product-list-tile-heading h3');
//           const link = getAttr('a[href^="https://www.sydney.com/destinations"]', 'href');
//           const image = getAttr('picture img', 'src');
//           const date = getText('.product__list-date.type__ribbon');
//           const description = getText('.prod-desc');
//           const city = getText('span.tile__area-name');

//           return { title, link, image, date, description, city };
//         })
//     );

//     await browser.close();

//     res.json({ events });
//   } catch (error) {
//     console.error('Puppeteer scrape error:', error);
//     res.status(500).json({ error: 'Failed to scrape events using Puppeteer' });
//   }
// };