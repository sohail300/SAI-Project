import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileText, Check, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Request {
  _id: string
  userId: string
  fileUrl: string
  fileType: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AdminViewRequests() {
  const navigate= useNavigate();
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [comment, setComment] = useState('');
  const [currentRequestId, setCurrentRequestId] = useState(null);
  
  const openApproveModal = (id) => {
    setCurrentRequestId(id);
    setApproveModal(true);
  };

  const openRejectModal = (id) => {
    setCurrentRequestId(id);
    setRejectModal(true);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/requests/', {
          headers: {
            token: localStorage.getItem('token') || ""
          }
        })
        console.log(response.data)
        setRequests(response.data)
      } catch (err) {
        setError('An error occurred while fetching your requests.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleAction = async (requestid: string, action: 'approve' | 'reject') => {
    try {
      const response = await axios.put(`http://localhost:3000/api/admin/requests/status`, {
        requestid,
        comment,
        status: action === 'approve' ? 'approved' : 'rejected'
      }, {
        headers: {
          token: localStorage.getItem('token') || "",
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to update request status');
      }
  
      // Update the local state
      setRequests(requests.map(req => 
        req._id === requestid ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
      ));
    } catch (err) {
      setError(`Failed to ${action} the request. Please try again.`);
    }
  }

  const handleSubmit = (action: 'approve' | 'reject') => {
      handleAction(currentRequestId || "", action);
      setApproveModal(false);
      setRejectModal(false);
      setComment('');
      setCurrentRequestId(null);
  }

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

  const ButtonCustom = ({ text, color, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full md:w-64 px-6 py-3 mb-4 text-lg font-semibold text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl ${color}`}
    >
      {text}
      <ArrowRight size={24} />
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
       <ButtonCustom
            text="LOGOUT"
            color="bg-red-500 hover:bg-red-600"
            onClick={() => {localStorage.removeItem('token'); navigate('/')}}
          />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All User Requests</CardTitle>
          <CardDescription>Manage house map approval requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <Alert className="max-w-lg mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Requests Found</AlertTitle>
              <AlertDescription>There are no pending requests at this time.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>View File</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium text-left">{request._id}</TableCell>
                    <TableCell className="text-left">{request.userId}</TableCell>
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
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => openApproveModal(request._id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() =>  openRejectModal(request._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={approveModal} onOpenChange={setApproveModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter any comments before approving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comments here..."
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit('approve')}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectModal} onOpenChange={setRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter any comments before approving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comments here..."
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit('reject')}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}