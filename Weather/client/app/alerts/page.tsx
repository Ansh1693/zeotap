"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { deleteAlert, getAlerts, createAlert } from "@/api/alert";
import cities from "@/lib/data/cities";
import { criteria, operators } from "@/lib/data/criteria";
import conditions from "@/lib/data/conditions";

type Alert = {
  id: string;
  city: string;
  condition: string;
  operator: string;
  value: string;
  times: number;
  email: string;
  resolved: boolean;
  timestamp: string;
};

type NewAlert = Omit<Alert, "id" | "resolved" | "timestamp">;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState<NewAlert>({
    city: "",
    condition: "",
    operator: "",
    value: "",
    times: 0,
    email: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getAlerts();
      setAlerts(data);
    };

    fetchAlerts();
  }, []);

  const handleCreateAlert = async () => {
    try {
      const condition =
        newAlert.condition + " " + newAlert.operator + " " + newAlert.value;
      const createdAlert = await createAlert(
        newAlert.city,
        condition,
        newAlert.times,
        newAlert.email
      );

      setAlerts([...alerts, createdAlert.alert]);
      setIsDialogOpen(false);
      setNewAlert({
        city: "",
        condition: "",
        operator: "",
        value: "",
        times: 0,
        email: "",
      });
      toast({
        title: "Alert Created",
        description: "Your new alert has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id);
      setAlerts(alerts.filter((alert) => alert.id !== id));
      toast({
        title: "Alert Deleted",
        description: "The alert has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unresolved = alerts.filter((alert) => !alert.resolved);
  const resolved = alerts.filter((alert) => alert.resolved);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alerts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Alert</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="city" className="text-right">
                  City
                </label>
                <Select
                  onValueChange={(value) =>
                    setNewAlert({ ...newAlert, city: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="condition" className="text-right">
                  Condition
                </label>
                <Select
                  onValueChange={(value) => {
                    setNewAlert({
                      ...newAlert,
                      condition: value,
                      operator: "",
                      value: "",
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {criteria.map((criterion) => (
                      <SelectItem key={criterion.value} value={criterion.value}>
                        {criterion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newAlert.condition && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="operator" className="text-right">
                    Operator
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setNewAlert({ ...newAlert, operator: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators
                        .filter(
                          (op) => op[newAlert.condition as keyof typeof op]
                        )
                        .map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {newAlert.condition === "condition" ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="value" className="text-right">
                    Value
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setNewAlert({ ...newAlert, value: value.toLowerCase() })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                newAlert.condition &&
                newAlert.operator && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="value" className="text-right">
                      Value
                    </label>
                    <Input
                      id="value"
                      className="col-span-3"
                      value={newAlert.value}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, value: e.target.value })
                      }
                    />
                  </div>
                )
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="times" className="text-right">
                  Times
                </label>
                <Input
                  id="times"
                  type="number"
                  className="col-span-3"
                  value={newAlert.times}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      times: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={newAlert.email}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, email: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={handleCreateAlert}>Create Alert</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Unresolved Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unresolved.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <CardTitle>{alert.city}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Condition: {alert.condition}</p>
                <p>Times: {alert.times}</p>
                <p>Email: {alert.email}</p>
                <p>Created: {new Date(alert.timestamp).toLocaleString()}</p>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Resolved Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolved.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <CardTitle>{alert.city}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Condition: {alert.condition}</p>
                <p>Times: {alert.times}</p>
                <p>Email: {alert.email}</p>
                <p>Created: {new Date(alert.timestamp).toLocaleString()}</p>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
