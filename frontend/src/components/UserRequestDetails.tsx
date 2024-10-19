import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import { FileText } from "lucide-react"

interface Request {
  _id: string
  fileUrl: string
  fileType: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function ViewRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/requests/', {
          headers: {
            token: localStorage.getItem('token') || ""
          }
        })
        setRequests(response.data.requests)
      } catch (err) {
        setError('An error occurred while fetching your requests.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Requests</CardTitle>
          <CardDescription>View all your house map approval requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <Alert className="max-w-lg mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Requests Found</AlertTitle>
              <AlertDescription>You haven't made any requests yet.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium text-left">{request._id}</TableCell>
                    <TableCell className="text-left">{request.fileType}</TableCell>
                    <TableCell className="text-left">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-left">
                      <a
                        href={request.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        <FileText className="h-6 w-6" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}