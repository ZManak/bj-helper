import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calculator, TrendingUp, Heart, Diamond, Club, Spade } from 'lucide-react'
import { calculateHandValue, getDecision } from '@/lib/blackjackLogic.js'
import './App.css'

function App() {
  const [playerHand, setPlayerHand] = useState('')
  const [dealerUpcard, setDealerUpcard] = useState('')
  const [numDecks, setNumDecks] = useState('6')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    setResult(null)

    // Validate inputs
    if (!playerHand.trim() || !dealerUpcard.trim()) {
      setError('Please enter both player hand and dealer upcard')
      return
    }

    try {
      // Parse player hand
      const handCards = playerHand.split(',').map(card => card.trim().toUpperCase())
      
      // Validate cards
      const validCards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      const invalidCards = handCards.filter(card => !validCards.includes(card))
      if (invalidCards.length > 0) {
        setError(`Invalid cards in hand: ${invalidCards.join(', ')}`)
        return
      }

      const dealerCard = dealerUpcard.trim().toUpperCase()
      if (!validCards.includes(dealerCard)) {
        setError('Invalid dealer upcard')
        return
      }

      // Calculate hand value and decision
      const { value, isSoft } = calculateHandValue(handCards)
      const decision = getDecision(handCards, dealerCard, parseInt(numDecks))

      setResult({
        handValue: value,
        isSoft,
        decision,
        playerCards: handCards,
        dealerCard,
        numDecks: parseInt(numDecks)
      })
    } catch (err) {
      setError('Error calculating decision. Please check your input.')
    }
  }

  const getSuitIcon = (card) => {
    // Simple mapping for visual appeal
    if (card === 'A') return <Spade className="w-4 h-4 inline" />
    if (['K', 'Q', 'J'].includes(card)) return <Heart className="w-4 h-4 inline" />
    if (['10', '9', '8', '7'].includes(card)) return <Diamond className="w-4 h-4 inline" />
    return <Club className="w-4 h-4 inline" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Calculator className="w-8 h-8" />
            Blackjack Helper
          </h1>
          <p className="text-green-100 text-lg">
            Get optimal Hit/Stand recommendations based on basic strategy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Game Input
              </CardTitle>
              <CardDescription>
                Enter your hand and dealer's upcard to get strategy advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="playerHand">Your Hand (comma-separated)</Label>
                <Input
                  id="playerHand"
                  placeholder="e.g., A,7 or K,Q or 10,6"
                  value={playerHand}
                  onChange={(e) => setPlayerHand(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use A for Ace, J/Q/K for face cards, 2-10 for number cards
                </p>
              </div>

              <div>
                <Label htmlFor="dealerUpcard">Dealer's Upcard</Label>
                <Input
                  id="dealerUpcard"
                  placeholder="e.g., 7, A, K"
                  value={dealerUpcard}
                  onChange={(e) => setDealerUpcard(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="numDecks">Number of Decks</Label>
                <Select value={numDecks} onValueChange={setNumDecks}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Deck</SelectItem>
                    <SelectItem value="2">2 Decks</SelectItem>
                    <SelectItem value="4">4 Decks</SelectItem>
                    <SelectItem value="6">6 Decks</SelectItem>
                    <SelectItem value="8">8 Decks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCalculate} 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Calculate Strategy
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Strategy Recommendation</CardTitle>
              <CardDescription>
                Based on basic Blackjack strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">Your Hand:</span>
                    {result.playerCards.map((card, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {getSuitIcon(card)}
                        {card}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Dealer's Upcard:</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getSuitIcon(result.dealerCard)}
                      {result.dealerCard}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Hand Value</p>
                      <p className="text-lg font-semibold">
                        {result.handValue}
                        {result.isSoft && <span className="text-sm text-blue-600 ml-1">(Soft)</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Decks</p>
                      <p className="text-lg font-semibold">{result.numDecks}</p>
                    </div>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <p className="text-sm text-muted-foreground mb-2">Recommended Action</p>
                    <p className={`text-3xl font-bold ${
                      result.decision === 'Hit' 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {result.decision.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>This recommendation is based on basic Blackjack strategy. It does not guarantee winning, as Blackjack is a game of chance. Always gamble responsibly.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Enter your hand and dealer's upcard to get a recommendation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Strategy Info */}
        <Card className="mt-6 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle>Basic Strategy Rules</CardTitle>
            <CardDescription>
              Quick reference for optimal Blackjack play
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Hard Totals</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Always hit on 8 or less</li>
                  <li>• Always stand on 17 or more</li>
                  <li>• Hit on 12 vs dealer 2-3, 7-A</li>
                  <li>• Stand on 12 vs dealer 4-6</li>
                  <li>• Hit on 13-16 vs dealer 7-A</li>
                  <li>• Stand on 13-16 vs dealer 2-6</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Soft Totals</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Always hit on Soft 17 or less</li>
                  <li>• Always stand on Soft 19 or more</li>
                  <li>• Soft 18: Stand vs 2, 7, 8</li>
                  <li>• Soft 18: Hit vs 9, 10, A</li>
                  <li>• A hand is "soft" when it contains an Ace counted as 11</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

