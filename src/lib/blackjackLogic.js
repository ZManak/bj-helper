// Blackjack logic functions converted from Python to JavaScript

export function calculateHandValue(hand) {
    /**
     * Calculates the value of a Blackjack hand.
     * @param {Array} hand - A list of cards in the hand (e.g., ["A", "5", "K"]).
     * @returns {Object} An object containing {value, isSoft}, where value is the hand's total
     *                   and isSoft is a boolean indicating if the hand is soft (contains a usable Ace).
     */
    let value = 0;
    let numAces = 0;
    
    for (const card of hand) {
        if (['J', 'Q', 'K'].includes(card)) {
            value += 10;
        } else if (card === 'A') {
            numAces += 1;
            value += 11; // Assume Ace is 11 initially
        } else {
            value += parseInt(card);
        }
    }

    const initialAcesAs11 = numAces; // Store the initial number of aces that were counted as 11

    // Adjust for Aces if hand value exceeds 21
    while (value > 21 && numAces > 0) {
        value -= 10; // Change Ace from 11 to 1
        numAces -= 1;
    }

    // A hand is soft if it initially contained an Ace counted as 11 and the final value is not busted.
    const isSoft = (initialAcesAs11 > 0 && value <= 21);
    return { value, isSoft };
}

export function getDecision(playerHand, dealerUpcard, numDecks = 6) {
    /**
     * Determines the optimal Blackjack decision (Hit or Stand) based on basic strategy.
     * @param {Array} playerHand - Player's current hand (e.g., ["A", "7"]).
     * @param {string} dealerUpcard - Dealer's visible card (e.g., "7", "A").
     * @param {number} numDecks - Number of decks in play (default is 6).
     * @returns {string} 'Hit' or 'Stand'.
     */
    const { value: playerValue, isSoft } = calculateHandValue(playerHand);

    // Convert dealer_upcard to integer for easier comparison
    let dealerValue;
    if (['J', 'Q', 'K'].includes(dealerUpcard)) {
        dealerValue = 10;
    } else if (dealerUpcard === 'A') {
        dealerValue = 11;
    } else {
        dealerValue = parseInt(dealerUpcard);
    }

    // Basic Strategy Rules (simplified for Hit/Stand only)

    // Hard Totals
    if (!isSoft) {
        if (playerValue >= 17) {
            return 'Stand';
        } else if (playerValue <= 11) {
            return 'Hit';
        } else if (playerValue === 12) {
            if ([4, 5, 6].includes(dealerValue)) {
                return 'Stand';
            } else {
                return 'Hit';
            }
        } else if (13 <= playerValue && playerValue <= 16) {
            if (dealerValue >= 7) {
                return 'Hit';
            } else {
                return 'Stand';
            }
        }
    }
    // Soft Totals
    else {
        if (playerValue >= 19) {
            return 'Stand';
        } else if (playerValue <= 17) {
            return 'Hit';
        } else if (playerValue === 18) {
            if ([2, 7, 8].includes(dealerValue)) {
                return 'Stand';
            } else {
                return 'Hit';
            }
        }
    }

    return 'Hit'; // Default to hit if no specific rule applies (shouldn't happen with comprehensive rules)
}

