const fs = require('fs');
const path = require('path');

const srcDirectory = path.join(__dirname, 'src');

const replacements = [
    { regex: /SupplierGrid/g, replace: 'PromoterGrid' },
    { regex: /SupplierForm/g, replace: 'PromoterForm' },
    { regex: /supplier\.module\.css/g, replace: 'promoter.module.css' },
    { regex: /suppliers\.module\.css/g, replace: 'promoters.module.css' },
    { regex: /suppliers\.ts/g, replace: 'promoters.ts' },

    { regex: /Fournisseurs/g, replace: 'Promoteurs' },
    { regex: /fournisseurs/g, replace: 'promoteurs' },
    { regex: /Fournisseur/g, replace: 'Promoteur' },
    { regex: /fournisseur/g, replace: 'promoteur' },
    { regex: /FOURNISSEUR/g, replace: 'PROMOTEUR' },

    { regex: /Suppliers/g, replace: 'Promoters' },
    { regex: /suppliers/g, replace: 'promoters' },
    { regex: /Supplier/g, replace: 'Promoter' },
    { regex: /supplier/g, replace: 'promoter' },
    { regex: /SUPPLIER/g, replace: 'PROMOTER' },
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDirectory);
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(({ regex, replace }) => {
        content = content.replace(regex, replace);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Replacement complete. Modified ${changedCount} files.`);
