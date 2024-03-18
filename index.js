const express = require('express');
require('dotenv').config();
const ethers = require('ethers');
const { JSDOM } = require('jsdom');
const xmlserializer = require('xmlserializer');

const app = express();
const port = 3000;

app.use(express.static('public'));

// Your contract ABI and address
const contractABI = [{"inputs":[{"internalType":"address","name":"_noundersDAO","type":"address"},{"internalType":"address","name":"_minter","type":"address"},{"internalType":"contract INounsDescriptor","name":"_descriptor","type":"address"},{"internalType":"contract INounsSeeder","name":"_seeder","type":"address"},{"internalType":"contract IProxyRegistry","name":"_proxyRegistry","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DescriptorLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract INounsDescriptor","name":"descriptor","type":"address"}],"name":"DescriptorUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"MinterLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"}],"name":"MinterUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NounBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"components":[{"internalType":"uint48","name":"background","type":"uint48"},{"internalType":"uint48","name":"body","type":"uint48"},{"internalType":"uint48","name":"accessory","type":"uint48"},{"internalType":"uint48","name":"head","type":"uint48"},{"internalType":"uint48","name":"glasses","type":"uint48"}],"indexed":false,"internalType":"struct INounsSeeder.Seed","name":"seed","type":"tuple"}],"name":"NounCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"noundersDAO","type":"address"}],"name":"NoundersDAOUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"SeederLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract INounsSeeder","name":"seeder","type":"address"}],"name":"SeederUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"nounId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint96","name":"votes","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"dataURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"descriptor","outputs":[{"internalType":"contract INounsDescriptor","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isDescriptorLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isMinterLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isSeederLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockDescriptor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lockMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lockSeeder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"noundersDAO","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyRegistry","outputs":[{"internalType":"contract IProxyRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"seeder","outputs":[{"internalType":"contract INounsSeeder","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"seeds","outputs":[{"internalType":"uint48","name":"background","type":"uint48"},{"internalType":"uint48","name":"body","type":"uint48"},{"internalType":"uint48","name":"accessory","type":"uint48"},{"internalType":"uint48","name":"head","type":"uint48"},{"internalType":"uint48","name":"glasses","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newContractURIHash","type":"string"}],"name":"setContractURIHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract INounsDescriptor","name":"_descriptor","type":"address"}],"name":"setDescriptor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_noundersDAO","type":"address"}],"name":"setNoundersDAO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract INounsSeeder","name":"_seeder","type":"address"}],"name":"setSeeder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"votesToDelegate","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"}];
const contractAddress = '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03'; // Your contract's address

// Set up a provider (Assuming you're using the Ethereum mainnet here)
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/' + process.env.INFURA_API_KEY);

// Your contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

app.get('/noun-dancer/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId;
  try {
    const tokenURI = await contract.tokenURI(tokenId);
    const metadata = JSON.parse(Buffer.from(tokenURI.split(',')[1], 'base64').toString('utf-8'));
    const imageUrl = metadata.image;
    const base64EncodedSVG = imageUrl.split(',')[1];
    const svgData = Buffer.from(base64EncodedSVG, 'base64').toString('utf-8');

    const dom = new JSDOM(svgData, {
      contentType: 'image/svg+xml',
    });

    const colorGroups = {};

    const document = dom.window.document;
    const svg = document.querySelector('svg');
    svg.querySelector('rect').remove();
    const bodyGroup = document.createElement('g');
    bodyGroup.setAttribute('id', 'body');
    const headGroup = document.createElement('g');
    headGroup.setAttribute('id', 'head');

    // Group rects
    const rects = svg.querySelectorAll('rect');
    const headYMax = 210; // Adjust as needed
    const bodyYMin = 110; // Adjust as needed

    rects.forEach(rect => {
      const rectY = parseFloat(rect.getAttribute('y'));
      if (rectY < headYMax) {
        headGroup.appendChild(rect.cloneNode(true));
      } else {
        bodyGroup.appendChild(rect.cloneNode(true));
      }
      rect.remove();
    });

    const headFillColors = new Set();
    const bodyFillColors = new Set();
    headGroup.querySelectorAll('rect').forEach(rect => {
      const fillColor = rect.getAttribute('fill');
      headFillColors.add(fillColor);
    });

    const bodyRects = bodyGroup.querySelectorAll('rect');
    const overlappingBodyRects = [];
    bodyRects.forEach(bodyRect => {
      const bodyFillColor = bodyRect.getAttribute('fill');
      bodyFillColors.add(bodyFillColor);
      if (headFillColors.has(bodyFillColor)) {
        overlappingBodyRects.push(bodyRect);
      }
    });

    overlappingBodyRects.forEach(bodyRect => {
      const clonedRect = bodyRect.cloneNode(true);
      headGroup.appendChild(clonedRect);
    });

    const bodyMainColor = getMainColor(Array.from(bodyFillColors));
    overlappingBodyRects.forEach(rect => {
      const rectX = parseFloat(rect.getAttribute('x'));
      const rectWidth = parseFloat(rect.getAttribute('width'));

      if (rectX < 90 || rectX + rectWidth > 230) {
        rect.remove();
      } else {
        if (rectX < 120) {
          const newWidth = rectWidth - (120 - rectX);
          rect.setAttribute('width', newWidth);
          rect.setAttribute('x', '120');
        } else if (rectX + rectWidth > 230) {
          const newWidth = rectWidth - ((rectX + rectWidth) - 230);
          rect.setAttribute('width', newWidth);
        }
        rect.setAttribute('fill', bodyMainColor);
      }
    });

    svg.appendChild(bodyGroup);
    svg.appendChild(headGroup);
    const serializedSVG = xmlserializer.serializeToString(svg);
    res.set('Content-Type', 'image/svg+xml');
    res.send(serializedSVG);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing the SVG.');
  }
});

function getMainColor(colors) {
  return colors[0];
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
