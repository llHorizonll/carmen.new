import { Button, Card, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { loginHint } from '../../lib/mockData'

export function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('maya.finance@carmen.cloud')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/tenant-selection" replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    await login(email, password)
    setLoading(false)
    navigate('/tenant-selection')
  }

  return (
    <div className="auth-page">
      <div className="auth-page-glow" />
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="auth-card premium-card"
        p="xl"
      >
        <Stack gap="md">
          <div>
            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
              Carmen Cloud Finance
            </Text>
            <Title order={2}>Hotel Accounting Operations</Title>
            <Text c="dimmed" size="sm" mt={6}>
              Tenant-aware access for hospitality finance teams.
            </Text>
          </div>
          <form onSubmit={onSubmit}>
            <Stack gap="sm">
              <TextInput label="Email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} placeholder="finance@hotelgroup.com" required />
              <PasswordInput label="Password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} placeholder="********" required />
              <Text size="xs" c="dimmed">
                {loginHint}
              </Text>
              <Button type="submit" loading={loading} rightSection={<IconArrowRight size={16} />}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  )
}
