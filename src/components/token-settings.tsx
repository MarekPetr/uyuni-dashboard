import { useState } from 'react'
import { KeyIcon, LogOutIcon } from 'lucide-react'
import { clearToken, getToken, setToken } from '@/lib/github/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TokenSettingsProps {
  onTokenChange: () => void
}

export function TokenSettings({ onTokenChange }: TokenSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')
  const [hasToken, setHasToken] = useState(!!getToken())

  const handleSave = () => {
    const trimmed = value.trim()
    if (trimmed) {
      setToken(trimmed)
      setValue('')
      setIsEditing(false)
      setHasToken(true)
      onTokenChange()
    }
  }

  const handleClear = () => {
    clearToken()
    setHasToken(false)
    onTokenChange()
  }

  if (isEditing) {
    return (
      <div className="space-y-2 border-t border-border p-2">
        <p className="px-1 text-xs text-muted-foreground">
          Paste a{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            GitHub token
          </a>{' '}
          to increase rate limits and access projects.
        </p>
        <Input
          type="password"
          placeholder="ghp_..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="h-8 text-xs"
        />
        <div className="flex gap-1">
          <Button size="sm" className="h-7 flex-1 text-xs" onClick={handleSave}>
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => {
              setIsEditing(false)
              setValue('')
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-border p-2">
      {hasToken ? (
        <div className="flex items-center gap-1">
          <span className="flex-1 truncate px-1 text-xs text-muted-foreground">
            <KeyIcon className="mr-1 inline size-3 text-green-500" />
            Token configured
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => setIsEditing(true)}
          >
            Change
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-destructive"
            onClick={handleClear}
          >
            <LogOutIcon className="size-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-full text-xs text-muted-foreground"
          onClick={() => setIsEditing(true)}
        >
          <KeyIcon className="mr-1 size-3" />
          Set GitHub Token
        </Button>
      )}
    </div>
  )
}
