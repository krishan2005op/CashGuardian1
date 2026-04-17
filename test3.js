const clients = ["Nandan Enterprises", "Krishan Distributors", "Sharma Retail"];
function extractClientName(userInput) {
  const normalizedInput = userInput.toLowerCase();
  
  // 1. Exact full name match
  let match = clients.find((client) => normalizedInput.includes(client.toLowerCase()));
  if (match) return match;

  // 2. Partial match (first word)
  match = clients.find((client) => {
     const clientFirstName = client.toLowerCase().split(' ')[0];
     const regex = new RegExp(`\\b${clientFirstName}\\b`);
     return regex.test(normalizedInput);
  });
  
  return match || null;
}

console.log(extractClientName("Send reminder to Krishan")); // Should be Krishan Distributors
console.log(extractClientName("Send reminder to Nandan")); // Should be Nandan Enterprises
console.log(extractClientName("Send reminder to Nandan Enterprises")); // Should be Nandan Enterprises
console.log(extractClientName("What about Sharma?")); // Should be Sharma Retail
