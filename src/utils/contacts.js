const MAX_RECENT_CONTACTS_LENGTH = 5;

export function updateRecentContacts(allContacts, recentContacts, transaction) {
  const index = allContacts.findIndex((contact) => contact.address === transaction.to);
  if (index < 0) {
    return recentContacts;
  }

  const newRecentContact = allContacts[index];
  const updatedRecentContacts = recentContacts.filter((contact) => contact.address !== transaction.to);
  // This is for if the transaction.to does not already exist in recent contacts
  if (updatedRecentContacts.length >= MAX_RECENT_CONTACTS_LENGTH) {
    return [newRecentContact, ...updatedRecentContacts.slice(0, MAX_RECENT_CONTACTS_LENGTH - 1)];
  }
  return [newRecentContact, ...updatedRecentContacts];
}

