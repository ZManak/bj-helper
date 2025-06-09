
import collections

def calculate_hand_value(hand):
    """
    Calculates the value of a Blackjack hand.
    Args:
        hand (list): A list of cards in the hand (e.g., ["A", "5", "K"]).
    Returns:
        tuple: A tuple containing (value, is_soft), where value is the hand's total
               and is_soft is a boolean indicating if the hand is soft (contains a usable Ace).
    """
    value = 0
    num_aces = 0
    for card in hand:
        if card in ['J', 'Q', 'K']:
            value += 10
        elif card == 'A':
            num_aces += 1
            value += 11  # Assume Ace is 11 initially
        else:
            value += int(card)

    initial_aces_as_11 = num_aces # Store the initial number of aces that were counted as 11

    # Adjust for Aces if hand value exceeds 21
    while value > 21 and num_aces > 0:
        value -= 10  # Change Ace from 11 to 1
        num_aces -= 1

    # A hand is soft if it initially contained an Ace counted as 11 and the final value is not busted.
    is_soft = (initial_aces_as_11 > 0 and value <= 21)
    return value, is_soft

def get_decision(player_hand, dealer_upcard, num_decks=6):
    """
    Determines the optimal Blackjack decision (Hit or Stand) based on basic strategy.
    Args:
        player_hand (list): Player's current hand (e.g., ["A", "7"]).
        dealer_upcard (str): Dealer's visible card (e.g., "7", "A").
        num_decks (int): Number of decks in play (default is 6).
    Returns:
        str: 'Hit' or 'Stand'.
    """
    player_value, is_soft = calculate_hand_value(player_hand)

    # Convert dealer_upcard to integer for easier comparison
    if dealer_upcard in ['J', 'Q', 'K']:
        dealer_value = 10
    elif dealer_upcard == 'A':
        dealer_value = 11
    else:
        dealer_value = int(dealer_upcard)

    # Basic Strategy Rules (simplified for Hit/Stand only)

    # Hard Totals
    if not is_soft:
        if player_value >= 17:
            return 'Stand'
        elif player_value <= 11:
            return 'Hit'
        elif player_value == 12:
            if dealer_value in [4, 5, 6]:
                return 'Stand'
            else:
                return 'Hit'
        elif 13 <= player_value <= 16:
            if dealer_value >= 7:
                return 'Hit'
            else:
                return 'Stand'

    # Soft Totals
    else:
        if player_value >= 19:
            return 'Stand'
        elif player_value <= 17:
            return 'Hit'
        elif player_value == 18:
            if dealer_value in [2, 7, 8]:
                return 'Stand'
            else:
                return 'Hit'

    return 'Hit' # Default to hit if no specific rule applies (shouldn't happen with comprehensive rules)


