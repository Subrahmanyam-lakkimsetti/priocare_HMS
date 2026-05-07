const fs = require('fs');

const filesToUpdate = [
  'src/components/shared/PatientSidebar.jsx',
  'src/features/auth/Login.jsx',
  'src/features/auth/register.jsx',
  'src/pages/EntryPage.jsx',
];

filesToUpdate.forEach((file) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add import if not present
  if (!content.includes('import Logo from')) {
    let relative = '../../components/shared/Logo';
    if (file.includes('auth')) relative = '../../components/shared/Logo';
    if (file.includes('shared')) relative = './Logo';
    if (file.includes('pages')) relative = '../components/shared/Logo';

    const importRegex = /(import [^;]+;\n)+/;
    const match = content.match(importRegex);
    if (match) {
      content = content.replace(
        match[0],
        match[0] + "import Logo from '" + relative + "';\n",
      );
    } else {
      content = "import Logo from '" + relative + "';\n" + content;
    }
  }

  // Generic replacement for the standard flex layout logos
  content = content.replace(
    /<div className="flex items-center gap-2[\s\S]*?Prio<span[^>]+>Care<\/span>[\s\S]*?<\/span>\s*<\/div>/g,
    '<Logo />',
  );

  // Specific replacements for where they broke it into separate tags
  content = content.replace(
    /<div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">[\s\S]*?<\/svg>\s*<\/div>\s*<span className="text-blue-900 text-xl font-bold tracking-tight">\s*Prio<span className="text-cyan-600">Care<\/span>\s*<\/span>/g,
    '<Logo />',
  );

  // For the large ones in login/register
  content = content.replace(
    /<div className="hidden md:flex items-center justify-center w-12 h-12[^>]*>[\s\S]*?<\/div>\s*<div className="flex flex-col">\s*<span className="text-blue-900 text-2xl font-bold tracking-tight">\s*Prio<span[^>]+>Care<\/span>\s*<\/span>\s*<span[^>]*>[\s\S]*?<\/span>\s*<\/div>/g,
    '<Logo className="scale-125 origin-left" />\n              <span className="text-slate-500 text-sm font-medium mt-1 tracking-wide uppercase ml-1">Hospital Management</span>',
  );

  // for the generic text ones without wrapping div
  content = content.replace(
    /<span className="text-blue-900 text-[^>]*>\s*Prio<span[^>]+>Care<\/span>\s*<\/span>/g,
    '<Logo />',
  );

  fs.writeFileSync(file, content, 'utf8');
  if (content !== original) {
    console.log('Updated', file);
  }
});
