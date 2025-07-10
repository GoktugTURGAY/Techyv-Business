const { createServer } = require("node:http");
const { readFileSync } = require("node:fs");
const { parse } = require("node:url");

const port = 8000;
const hostname = "localhost";
const jsonData = readFileSync(`${__dirname}/assets/products.json`, "utf-8");
const { products } = JSON.parse(jsonData);

const templateCard = readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const templateOverview = readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const templateProduct = readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const custom404 = readFileSync(
  `${__dirname}/templates/not-found.html`,
  "utf-8"
);

const replaceTemplate = (template, product) => {
  let output = template
    .replaceAll("{%ID%}", product.id)
    .replaceAll("{%PRODUCTNAME%}", product.productName)
    .replaceAll("{%CATEGORY%}", product.category)
    .replaceAll("{%BRAND%}", product.brand)
    .replaceAll("{%PRICE%}", product.price)
    .replaceAll("{%ICON%}", product.icon)
    .replaceAll("{%PRODUCTFEATURE1%}", product.features[0])
    .replaceAll("{%PRODUCTFEATURE2%}", product.features[1])
    .replaceAll("{%PRODUCTFEATURE3%}", product.features[2])
    .replaceAll("{%PRODUCTFEATURE4%}", product.features[3])
    .replaceAll("{%DESCRIPTION%}", product.description);

  return output;
};

const productCards = products
  .map((product) => replaceTemplate(templateCard, product))
  .slice(0, products.length)
  .join("");

const overviewGenerated = templateOverview.replace(
  "{%PRODUCTS%}",
  productCards
);

const server = createServer((req, res) => {
  const {
    pathname,
    query: { id },
  } = parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(overviewGenerated);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const individualProduct = replaceTemplate(
      templateProduct,
      products[+id - 1]
    );
    res.end(individualProduct);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end(custom404);
  }
});

server.listen(port, hostname, () => {
  console.log(`Listening to incoming requests on port ${port}...`);
});
