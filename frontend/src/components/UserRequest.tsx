import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import { useEffect } from 'react';

export default function RequestApproval() {
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !fileType) {
      setSubmitStatus({ type: 'error', message: 'Please select a file and file type.' })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', fileType)
    formData.append('userId', userId || "") // Replace with actual user ID

    try {
      const response = await axios.post('http://localhost:3000/api/user/requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: localStorage.getItem('token') || ""
        }
      });
    
      if (response.status === 201) {
        setSubmitStatus({ type: 'success', message: 'Request submitted successfully!' });
        setFile(null);
        setFileType("");
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to submit request.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit request.' });
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProfile = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.get('http://localhost:3000/me', {
      headers: {
        token: token
      }
    });

    console.log(response.data);
    setUserId(response.data._id);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">House Map Approval Request</CardTitle>
          <CardDescription className="text-center">
            Upload your house map file for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload House Map</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select value={fileType} onValueChange={setFileType} required>
                <SelectTrigger id="fileType">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blueprint">Blueprint</SelectItem>
                  <SelectItem value="sketch">Sketch</SelectItem>
                  <SelectItem value="3d-model">3D Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {submitStatus && (
            <Alert variant={submitStatus.type === 'success' ? 'default' : 'destructive'} className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{submitStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{submitStatus.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}